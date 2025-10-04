'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User, Loader2, Trash2, Copy, Check, Sparkles, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatbotAdvancedProps {
  className?: string;
  title?: string;
  placeholder?: string;
  welcomeMessage?: string;
}

export function ChatbotAdvanced({
  className,
  title = 'AI Assistant',
  placeholder = 'Ask me anything...',
  welcomeMessage = "Hello! I'm your AI assistant. How can I help you today?",
}: ChatbotAdvancedProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: welcomeMessage,
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
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

    // Simulate AI response with typing effect
    setTimeout(() => {
      const responses = [
        "That's an interesting question! Let me think about that for a moment...",
        "I understand what you're asking. Here's my perspective on that topic:",
        "Great question! Based on my knowledge, here's what I can tell you:",
        "I'd be happy to help with that. Let me provide you with some information:",
        "That's a thoughtful inquiry. Here's what I think about that:",
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const fullResponse = `${randomResponse} "${userMessage.content}" is a great topic to explore. In a real implementation, this would connect to an AI service like OpenAI, Anthropic, or your own backend API to provide intelligent responses.`;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fullResponse,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        content: welcomeMessage,
        role: 'assistant',
        timestamp: new Date(),
      },
    ]);
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    return isToday ? 'Today' : date.toLocaleDateString();
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
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
            <Badge variant='secondary' className='ml-2'>
              <MessageSquare className='h-3 w-3 mr-1' />
              {messages.length}
            </Badge>
          </CardTitle>
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
      </CardHeader>
      <Separator />
      <CardContent className='p-0'>
        <ScrollArea ref={scrollAreaRef} className='h-96 px-4'>
          <div className='space-y-4 pb-4 pt-4'>
            {messages.map((message, index) => {
              const showDate =
                index === 0 ||
                new Date(message.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString();

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className='flex items-center justify-center my-4'>
                      <Badge variant='outline' className='text-xs'>
                        {formatDate(message.timestamp)}
                      </Badge>
                    </div>
                  )}
                  <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
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
                      <div className='text-xs text-muted-foreground'>{formatTime(message.timestamp)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
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
