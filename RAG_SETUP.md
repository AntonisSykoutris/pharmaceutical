# RAG AI Assistant Setup Guide

This guide will help you set up the RAG (Retrieval-Augmented Generation) AI assistant with file upload capabilities, chat history, and Supabase integration.

## Prerequisites

1. **Supabase Project**: You need a Supabase project with the following:

   - Vector extension enabled
   - Storage bucket for documents
   - Database tables for RAG functionality

2. **OpenAI API Key**: For AI-powered responses and validation

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

## Database Setup

1. **Run the Migration**: Execute the SQL commands in `supabase-migration.sql` in your Supabase SQL editor.

2. **Enable Extensions**: Make sure these extensions are enabled in your Supabase project:

   - `uuid-ossp`
   - `vector`

3. **Create Storage Bucket**: The migration will create a `documents` bucket, but you can also create it manually in the Supabase dashboard.

## Features

### ✅ File Upload

- Upload up to 5 PDF files per session
- Automatic PDF text extraction and chunking
- File size validation (10MB limit)
- File management interface

### ✅ Chat History

- Persistent chat sessions
- Load previous conversations
- Session management
- Message history tracking

### ✅ RAG Functionality

- Document chunking and processing
- Vector search (when embeddings are implemented)
- Context-aware responses
- Source citation

### ✅ AI Integration

- OpenAI GPT-4 for answer generation
- Answer validation and accuracy checking
- Confidence scoring
- Professional pharmaceutical context

## API Endpoints

- `POST /api/upload` - Upload PDF files
- `POST /api/chat` - Send messages and get AI responses
- `GET /api/chat-sessions` - Get chat history
- `POST /api/chat-sessions` - Create new chat session
- `GET /api/uploaded-files` - Get uploaded files
- `DELETE /api/uploaded-files` - Delete uploaded files

## Usage

1. **Upload Documents**: Click the "Files" button to upload PDF documents
2. **Select Files**: Choose which files to include in your chat session
3. **Start Chatting**: Ask questions about your uploaded documents
4. **View History**: Access previous chat sessions via the "History" button
5. **Manage Files**: Add or remove files from your current session

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own files and chats
- File uploads are restricted to PDF format
- File size limits enforced

## Next Steps for Production

1. **Implement Vector Embeddings**: Add embedding generation for semantic search
2. **Add Authentication**: Ensure proper user authentication
3. **Error Handling**: Add comprehensive error handling
4. **Rate Limiting**: Implement API rate limiting
5. **Monitoring**: Add logging and monitoring
6. **Testing**: Add unit and integration tests

## Troubleshooting

- **Upload Issues**: Check file format (PDF only) and size (10MB max)
- **Chat Errors**: Verify OpenAI API key is valid
- **Database Errors**: Ensure all migrations have been run
- **Storage Issues**: Check Supabase storage bucket permissions
