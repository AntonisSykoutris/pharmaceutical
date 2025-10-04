/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { extractTextFromMultiplePDFs } from '@/lib/pdf-utils';
import {
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  Upload,
  FileText,
  History,
  X,
  AlertCircle,
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: any[];
  confidence_score?: number;
  validation_result?: {
    is_accurate: boolean;
    reasoning: string;
    suggested_corrections?: string[];
  };
}

interface UploadedFile {
  id: string;
  filename: string;
  original_name: string;
  file_size: number;
  upload_date: string;
  status: 'processing' | 'completed' | 'failed';
  chunks_count?: number;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  file_ids: string[];
}

interface RAGChatbotProps {
  className?: string;
  title?: string;
  placeholder?: string;
  welcomeMessage?: string;
}

export function RAGChatbot({
  className,
  title = 'RAG AI Assistant',
  placeholder = 'Ask me anything about your uploaded documents...',
  welcomeMessage = "Hello! I'm your RAG AI assistant. Upload some PDF documents and ask me questions about them!",
}: RAGChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showFileManager, setShowFileManager] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [uploading, setUploading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchUploadedFiles();
    fetchChatSessions();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch('/api/uploaded-files');
      const data = await response.json();
      if (data.files) {
        setUploadedFiles(data.files);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const fetchChatSessions = async () => {
    try {
      const response = await fetch('/api/chat-sessions');
      const data = await response.json();
      if (data.sessions) {
        setChatSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const createNewSession = async (title: string) => {
    try {
      const response = await fetch('/api/chat-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, fileIds: selectedFiles }),
      });
      const data = await response.json();
      if (data.session) {
        setCurrentSession(data.session);
        setMessages([]);
        setChatSessions(prev => [data.session, ...prev]);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const loadSession = async (session: ChatSession) => {
    setCurrentSession(session);
    setSelectedFiles(session.file_ids);

    // Fetch messages for this session
    try {
      const response = await fetch(`/api/chat-sessions/${session.id}/messages`);
      const data = await response.json();
      if (data.messages) {
        setMessages(
          data.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      }
    } catch (error) {
      console.error('Error loading session messages:', error);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setUploading(true);
    const fileArray = Array.from(files);

    try {
      // Extract text from PDFs on the client side
      const fileContents = await extractTextFromMultiplePDFs(fileArray);

      // Prepare files for upload
      const filesForUpload = fileArray.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      }));

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: filesForUpload,
          fileContents: fileContents,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setUploadedFiles(prev => [...data.files, ...prev]);
        setSelectedFiles(prev => [...prev, ...data.files.map((f: any) => f.id)]);
        alert(`Successfully uploaded ${data.files.length} file(s)`);
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Create session if none exists
    if (!currentSession) {
      await createNewSession(`Chat ${new Date().toLocaleDateString()}`);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: currentSession?.id,
          fileIds: selectedFiles,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer,
        role: 'assistant',
        timestamp: new Date(),
        sources: data.sources,
        confidence_score: data.confidence_score,
        validation_result: data.validation_result,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setCurrentSession(null);
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/uploaded-files?fileId=${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
        setSelectedFiles(prev => prev.filter(id => id !== fileId));
        alert('File deleted successfully');
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={`w-full max-w-6xl mx-auto ${className}`}>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Bot className='h-5 w-5' />
                <Sparkles className='h-3 w-3 absolute -top-1 -right-1 text-yellow-500' />
              </div>
              {title}
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='ml-2'>
                <MessageSquare className='h-3 w-3 mr-1' />
                {messages.length}
              </Badge>
              <Badge variant='outline'>
                <FileText className='h-3 w-3 mr-1' />
                {selectedFiles.length} files
              </Badge>
            </div>
          </CardTitle>
          <div className='flex items-center gap-2'>
            <Dialog open={showFileManager} onOpenChange={setShowFileManager}>
              <DialogTrigger asChild>
                <Button variant='outline' size='sm'>
                  <Upload className='h-4 w-4 mr-1' />
                  Files
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-2xl'>
                <DialogHeader>
                  <DialogTitle>File Manager</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  <div className='border-2 border-dashed border-gray-300 rounded-lg p-4'>
                    <input
                      ref={fileInputRef}
                      type='file'
                      multiple
                      accept='.pdf'
                      onChange={e => e.target.files && handleFileUpload(e.target.files)}
                      className='hidden'
                    />
                    <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className='w-full'>
                      {uploading ? (
                        <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                      ) : (
                        <Upload className='h-4 w-4 mr-2' />
                      )}
                      Upload PDF Files (Max 5)
                    </Button>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='font-medium'>Uploaded Files:</h4>
                    {uploadedFiles.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>No files uploaded yet</p>
                    ) : (
                      <div className='space-y-2 max-h-60 overflow-y-auto'>
                        {uploadedFiles.map(file => (
                          <div key={file.id} className='flex items-center justify-between p-2 border rounded'>
                            <div className='flex items-center gap-2'>
                              <input
                                type='checkbox'
                                checked={selectedFiles.includes(file.id)}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setSelectedFiles(prev => [...prev, file.id]);
                                  } else {
                                    setSelectedFiles(prev => prev.filter(id => id !== file.id));
                                  }
                                }}
                              />
                              <FileText className='h-4 w-4' />
                              <div>
                                <p className='text-sm font-medium'>{file.original_name}</p>
                                <p className='text-xs text-muted-foreground'>
                                  {formatFileSize(file.file_size)} • {file.chunks_count || 0} chunks
                                </p>
                              </div>
                            </div>
                            <Button variant='ghost' size='sm' onClick={() => deleteFile(file.id)}>
                              <X className='h-4 w-4' />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showChatHistory} onOpenChange={setShowChatHistory}>
              <DialogTrigger asChild>
                <Button variant='outline' size='sm'>
                  <History className='h-4 w-4 mr-1' />
                  History
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-2xl'>
                <DialogHeader>
                  <DialogTitle>Chat History</DialogTitle>
                </DialogHeader>
                <div className='space-y-2 max-h-60 overflow-y-auto'>
                  {chatSessions.length === 0 ? (
                    <p className='text-sm text-muted-foreground'>No chat history yet</p>
                  ) : (
                    chatSessions.map(session => (
                      <div
                        key={session.id}
                        className='flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted'
                        onClick={() => loadSession(session)}
                      >
                        <div>
                          <p className='text-sm font-medium'>{session.title}</p>
                          <p className='text-xs text-muted-foreground'>
                            {new Date(session.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant='outline'>{session.file_ids.length} files</Badge>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant='ghost'
              size='sm'
              onClick={handleClearChat}
              className='text-muted-foreground hover:text-foreground'
            >
              <Trash2 className='h-4 w-4 mr-1' />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className='p-0'>
        <ScrollArea ref={scrollAreaRef} className='h-96 px-4'>
          <div className='space-y-4 pb-4 pt-4'>
            {messages.length === 0 && (
              <div className='text-center py-8 text-muted-foreground'>
                <Bot className='h-12 w-12 mx-auto mb-4 opacity-50' />
                <p>{welcomeMessage}</p>
                {selectedFiles.length > 0 && (
                  <p className='text-sm mt-2'>
                    Ready to answer questions about {selectedFiles.length} uploaded file(s)
                  </p>
                )}
              </div>
            )}

            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Avatar className='h-8 w-8 shrink-0'>
                  <AvatarFallback className='bg-primary text-primary-foreground'>
                    {message.role === 'user' ? <User className='h-4 w-4' /> : <Bot className='h-4 w-4' />}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[80%] space-y-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-lg px-3 py-2 text-sm relative group ${
                      message.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
                    }`}
                  >
                    <div className='whitespace-pre-wrap'>{message.content}</div>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity'
                      onClick={() => handleCopyMessage(message.id, message.content)}
                    >
                      {copiedMessageId === message.id ? (
                        <Check className='h-3 w-3 text-green-500' />
                      ) : (
                        <Copy className='h-3 w-3' />
                      )}
                    </Button>
                  </div>

                  {message.sources && message.sources.length > 0 && (
                    <div className='text-xs text-muted-foreground'>
                      Sources: {message.sources.map(s => s.uploaded_files?.original_name).join(', ')}
                    </div>
                  )}

                  {message.confidence_score && (
                    <div className='text-xs text-muted-foreground'>
                      Confidence: {Math.round(message.confidence_score * 100)}%
                    </div>
                  )}

                  {message.validation_result && (
                    <div className='text-xs flex items-center gap-1'>
                      {message.validation_result.is_accurate ? (
                        <Check className='h-3 w-3 text-green-500' />
                      ) : (
                        <AlertCircle className='h-3 w-3 text-yellow-500' />
                      )}
                      <span className={message.validation_result.is_accurate ? 'text-green-600' : 'text-yellow-600'}>
                        {message.validation_result.is_accurate ? 'Validated' : 'Needs Review'}
                      </span>
                    </div>
                  )}

                  <div className='text-xs text-muted-foreground'>{formatTime(message.timestamp)}</div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className='flex gap-3'>
                <Avatar className='h-8 w-8 shrink-0'>
                  <AvatarFallback className='bg-primary text-primary-foreground'>
                    <Bot className='h-4 w-4' />
                  </AvatarFallback>
                </Avatar>
                <div className='flex items-center gap-2 rounded-lg bg-muted px-3 py-2'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span className='text-sm text-muted-foreground'>AI is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <Separator />
        <div className='p-4'>
          <div className='flex gap-2'>
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className='flex-1'
            />
            <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} size='icon'>
              {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Send className='h-4 w-4' />}
            </Button>
          </div>
          <p className='text-xs text-muted-foreground mt-2 text-center'>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
