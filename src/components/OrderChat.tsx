'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, TextField, IconButton, Paper, Typography, Avatar, 
  CircularProgress, Button, Divider, Alert, Stack 
} from '@mui/material';
import { MdSend, MdPayment, MdPerson, MdClose } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';

interface Props {
  orderId: string;
  onClose?: () => void;
  stripeUrl?: string;
  isStaff?: boolean;
  customerName?: string;
  projectName?: string;
}

export default function OrderChat({ orderId, onClose, stripeUrl, isStaff, customerName, projectName }: Props) {
  const { data: session } = useSession();
  const t = useTranslations('Chat');
  const locale = useLocale();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, isPay = false) => {
    if (e) e.preventDefault();
    if (!text.trim() && !isPay) return;

    setSending(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: isPay ? t('paySent') : text, 
          isPaymentLink: isPay 
        })
      });

      if (res.ok) {
        setText('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Paper 
      elevation={24} 
      className="flex flex-col h-[600px] w-full max-w-lg bg-white overflow-hidden rounded-3xl border border-gray-100 shadow-2xl animate-in zoom-in-95 duration-300"
    >
      {/* Header */}
      <Box className="bg-venecos-black p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <Avatar sx={{ bgcolor: '#D4AF37' }}><MdPerson /></Avatar>
          <div>
            <Typography variant="subtitle2" className="font-bold leading-tight">
                {projectName ? `${projectName}` : t('orderChat')}
            </Typography>
            <Typography variant="caption" className="text-white/60 block -mt-1">
                {customerName ? `${customerName} • ` : ''}ID: #{orderId.slice(-6).toUpperCase()}
            </Typography>
          </div>
        </div>
        {onClose && (
          <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
            <MdClose />
          </IconButton>
        )}
      </Box>

      {/* Messages area */}
      <Box 
        ref={scrollRef}
        className="flex-grow p-4 overflow-y-auto bg-gray-50/50 space-y-4"
        sx={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((m) => {
          const isMe = m.senderId === (session?.user as any)?.id;
          return (
            <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`
                  max-w-[85%] rounded-2xl p-3 shadow-sm border
                  ${isMe 
                    ? 'bg-venecos-black text-white rounded-br-none border-black' 
                    : 'bg-white text-gray-800 rounded-bl-none border-gray-100'
                  }
                `}
              >
                <div className="flex justify-between items-center gap-4 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isMe ? 'text-venecos-gold' : 'text-gray-400'}`}>
                    {m.senderName}
                  </span>
                  <span className="text-[9px] opacity-40">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                <Typography variant="body2" className="leading-relaxed whitespace-pre-wrap">{m.text}</Typography>

                {m.isPaymentLink && stripeUrl && (
                  <Box className="mt-3">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      startIcon={<MdPayment />}
                      href={stripeUrl}
                      target="_blank"
                      sx={{ borderRadius: 99, fontWeight: 'bold', fontSize: '0.75rem', py: 1 }}
                    >
                      {t('completePayment')}
                    </Button>
                  </Box>
                )}
              </div>
            </div>
          );
        })}
      </Box>

      <Divider />

      {/* Input row */}
      <Box component="form" onSubmit={handleSend} className="p-4 bg-white flex flex-col gap-4">
        <Stack direction="row" spacing={3} alignItems="center">
            {isStaff && stripeUrl && (
                <IconButton 
                    onClick={() => handleSend(undefined, true)} 
                    disabled={sending} 
                    sx={{ bgcolor: 'rgba(212,175,55,0.1)', color: '#D4AF37', '&:hover': { bgcolor: 'rgba(212,175,55,0.2)' } }}
                    title="Send Payment Button"
                >
                    {locale === 'ar' ? null : <MdPayment />}
                </IconButton>
            )}
            <TextField 
                fullWidth 
                size="small" 
                placeholder={t('typeMessage')} 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                disabled={sending}
                sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: 99, bgcolor: '#F9FAFB' } 
                }}
            />
            <IconButton 
                type="submit" 
                color="primary" 
                disabled={!text.trim() || sending} 
                sx={{ 
                    bgcolor: '#D4AF37', 
                    color: 'white', 
                    '&:hover': { bgcolor: '#b5952f' }, 
                    '&.Mui-disabled': { bgcolor: '#f0f0f0' },
                    px: locale === 'ar' ? 3 : 1
                }}
            >
                {sending ? <CircularProgress size={20} color="inherit" /> : (locale === 'ar' ? <span className="text-sm font-bold">{t('send') || 'إرسال'}</span> : <MdSend />)}
            </IconButton>
        </Stack>
      </Box>
    </Paper>
  );
}
