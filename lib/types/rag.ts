export interface UploadedFile {
  id: string;
  user_id: string;
  filename: string;
  original_name: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  status: 'processing' | 'completed' | 'failed';
  chunks_count?: number;
}

export interface DocumentChunk {
  id: string;
  file_id: string;
  content: string;
  chunk_index: number;
  embedding: number[];
  metadata: {
    page_number?: number;
    section_title?: string;
    word_count: number;
  };
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  file_ids: string[];
}

export interface ChatMessage {
  id: string;
  session_id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  sources?: DocumentChunk[];
  confidence_score?: number;
}

export interface RAGResponse {
  answer: string;
  sources: DocumentChunk[];
  confidence_score: number;
  validation_result?: {
    is_accurate: boolean;
    reasoning: string;
    suggested_corrections?: string[];
  };
}
