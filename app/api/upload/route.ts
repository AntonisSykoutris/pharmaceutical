/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createClientBrowser } from '@/lib/supabase/client';
import { pdf } from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (files.length > 5) {
      return NextResponse.json({ error: 'Maximum 5 files allowed' }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
      }

      const fileId = uuidv4();
      const buffer = await file.arrayBuffer();
      
      // Parse PDF content
      const pdfData = await pdf(Buffer.from(buffer));
      const content = pdfData.text;

      if (!content.trim()) {
        return NextResponse.json({ error: 'PDF appears to be empty or corrupted' }, { status: 400 });
      }

      // Create file record in database
      const { data: fileRecord, error: fileError } = await supabase
        .from('uploaded_files')
        .insert({
          id: fileId,
          user_id: user.id,
          filename: `${fileId}.pdf`,
          original_name: file.name,
          file_size: file.size,
          file_type: file.type,
          status: 'processing'
        })
        .select()
        .single();

      if (fileError) {
        console.error('Error creating file record:', fileError);
        return NextResponse.json({ error: 'Failed to create file record' }, { status: 500 });
      }

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`${user.id}/${fileId}.pdf`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        // Clean up database record
        await supabase.from('uploaded_files').delete().eq('id', fileId);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
      }

      // Process PDF content and create chunks
      const chunks = await processPDFContent(content, fileId);
      
      // Store chunks in database
      const { error: chunksError } = await supabase
        .from('document_chunks')
        .insert(chunks);

      if (chunksError) {
        console.error('Error storing chunks:', chunksError);
        return NextResponse.json({ error: 'Failed to process document chunks' }, { status: 500 });
      }

      // Update file status to completed
      await supabase
        .from('uploaded_files')
        .update({ 
          status: 'completed',
          chunks_count: chunks.length
        })
        .eq('id', fileId);

      uploadedFiles.push({
        ...fileRecord,
        chunks_count: chunks.length
      });
    }

    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processPDFContent(content: string, fileId: string) {
  // Split content into chunks (adjust chunk size as needed)
  const chunkSize = 1000; // characters
  const overlap = 200; // characters overlap between chunks
  
  const chunks = [];
  let start = 0;
  let chunkIndex = 0;

  while (start < content.length) {
    const end = Math.min(start + chunkSize, content.length);
    let chunkContent = content.slice(start, end);
    
    // Try to end at a sentence boundary
    if (end < content.length) {
      const lastSentenceEnd = chunkContent.lastIndexOf('.');
      if (lastSentenceEnd > chunkSize * 0.7) { // Only if we're not cutting off too much
        chunkContent = chunkContent.slice(0, lastSentenceEnd + 1);
      }
    }

    chunks.push({
      id: uuidv4(),
      file_id: fileId,
      content: chunkContent.trim(),
      chunk_index: chunkIndex,
      embedding: [], // Will be populated by embedding service
      metadata: {
        word_count: chunkContent.split(/\s+/).length,
        page_number: Math.floor(chunkIndex / 3) + 1, // Rough estimate
      },
      created_at: new Date().toISOString()
    });

    start = start + chunkContent.length - overlap;
    chunkIndex++;
  }

  return chunks;
}
