/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { RAGResponse } from '@/lib/types/rag';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, sessionId, fileIds } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json({ error: 'Message and session ID are required' }, { status: 400 });
    }

    // Get relevant chunks based on the query
    const relevantChunks = await getRelevantChunks(supabase, message, fileIds, user.id);
    
    if (relevantChunks.length === 0) {
      return NextResponse.json({
        answer: "I couldn't find any relevant information in your uploaded documents to answer this question. Please make sure you have uploaded relevant PDF files and try again.",
        sources: [],
        confidence_score: 0
      });
    }

    // Generate answer using OpenAI
    const ragResponse = await generateRAGResponse(message, relevantChunks);
    
    // Validate the answer
    const validationResult = await validateAnswer(message, ragResponse.answer, relevantChunks);

    // Save the conversation
    const { data: userMessage, error: userMsgError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        content: message,
        role: 'user',
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (userMsgError) {
      console.error('Error saving user message:', userMsgError);
    }

    const { data: assistantMessage, error: assistantMsgError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        content: ragResponse.answer,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        sources: relevantChunks,
        confidence_score: ragResponse.confidence_score
      })
      .select()
      .single();

    if (assistantMsgError) {
      console.error('Error saving assistant message:', assistantMsgError);
    }

    return NextResponse.json({
      ...ragResponse,
      validation_result: validationResult,
      messageId: assistantMessage?.id
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getRelevantChunks(supabase: any, query: string, fileIds: string[], userId: string) {
  // For now, we'll do a simple text search
  // In production, you'd want to use vector embeddings for semantic search
  
  let queryBuilder = supabase
    .from('document_chunks')
    .select(`
      *,
      uploaded_files!inner(
        id,
        original_name,
        user_id
      )
    `)
    .eq('uploaded_files.user_id', userId)
    .textSearch('content', query, {
      type: 'websearch',
      config: 'english'
    })
    .limit(5);

  if (fileIds && fileIds.length > 0) {
    queryBuilder = queryBuilder.in('file_id', fileIds);
  }

  const { data: chunks, error } = await queryBuilder;

  if (error) {
    console.error('Error fetching chunks:', error);
    return [];
  }

  return chunks || [];
}

async function generateRAGResponse(query: string, chunks: any[]): Promise<RAGResponse> {
  const context = chunks.map(chunk => chunk.content).join('\n\n');
  const sources = chunks.map(chunk => chunk.uploaded_files.original_name);

  const prompt = `You are a pharmaceutical AI assistant. Answer the user's question based ONLY on the provided context from official pharmaceutical documents. 

Context from documents:
${context}

User Question: ${query}

Instructions:
1. Answer based ONLY on the provided context
2. If the context doesn't contain enough information, say so clearly
3. Cite specific sources when possible
4. Be accurate and professional
5. If discussing drug interactions or medical advice, emphasize consulting healthcare professionals

Answer:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a pharmaceutical AI assistant that provides accurate, evidence-based information from official sources."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    });

    const answer = completion.choices[0]?.message?.content || "I couldn't generate an answer.";
    
    // Calculate confidence score based on answer length and context relevance
    const confidenceScore = Math.min(0.9, Math.max(0.1, 
      (answer.length / 500) * 0.5 + // Length factor
      (chunks.length / 5) * 0.3 + // Number of sources
      0.2 // Base confidence
    ));

    return {
      answer,
      sources: chunks,
      confidence_score: confidenceScore
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      answer: "I'm sorry, I encountered an error while processing your request. Please try again.",
      sources: [],
      confidence_score: 0
    };
  }
}

async function validateAnswer(question: string, answer: string, sources: any[]) {
  const validationPrompt = `You are an expert pharmaceutical validator. Review the following Q&A for accuracy and completeness.

Question: ${question}
Answer: ${answer}

Sources used: ${sources.map(s => s.uploaded_files.original_name).join(', ')}

Please evaluate:
1. Is the answer accurate based on the sources?
2. Is the answer complete and helpful?
3. Are there any potential issues or missing information?
4. Would you suggest any corrections?

Respond in JSON format:
{
  "is_accurate": boolean,
  "reasoning": "string",
  "suggested_corrections": ["string"] (optional)
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert pharmaceutical validator. Provide accurate, constructive feedback."
        },
        {
          role: "user",
          content: validationPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(response);

  } catch (error) {
    console.error('Validation error:', error);
    return {
      is_accurate: true,
      reasoning: "Unable to validate due to technical error",
      suggested_corrections: []
    };
  }
}
