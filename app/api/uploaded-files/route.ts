import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all uploaded files for the user
    const { data: files, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('user_id', user.id)
      .order('upload_date', { ascending: false });

    if (error) {
      console.error('Error fetching files:', error);
      return NextResponse.json({ error: 'Failed to fetch uploaded files' }, { status: 500 });
    }

    return NextResponse.json({ files });

  } catch (error) {
    console.error('Files error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([`${user.id}/${fileId}.pdf`]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
    }

    // Delete chunks
    const { error: chunksError } = await supabase
      .from('document_chunks')
      .delete()
      .eq('file_id', fileId);

    if (chunksError) {
      console.error('Error deleting chunks:', chunksError);
    }

    // Delete file record
    const { error: fileError } = await supabase
      .from('uploaded_files')
      .delete()
      .eq('id', fileId)
      .eq('user_id', user.id);

    if (fileError) {
      console.error('Error deleting file record:', fileError);
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
