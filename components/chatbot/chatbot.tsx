'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatbotProps {
  className?: string;
}

export function Chatbot({ className }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${userMessage.content}". This is a simulated response. In a real implementation, you would connect this to an AI service like OpenAI, Anthropic, or your own backend.`,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2'>
          <Bot className='h-5 w-5' />
          AI Assistant
          <Badge variant='secondary' className='ml-auto'>
            {messages.length} messages
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <ScrollArea ref={scrollAreaRef} className='h-96 px-4'>
          <div className='space-y-4 pb-4'>
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
                    className={`rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
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
                  <span className='text-sm text-muted-foreground'>Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className='border-t p-4'>
          <div className='flex gap-2'>
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Type your message here...'
              disabled={isLoading}
              className='flex-1'
            />
            <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} size='icon'>
              <Send className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
