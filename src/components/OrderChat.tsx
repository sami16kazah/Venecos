'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, TextField, IconButton, Paper, Typography, Avatar, 
  CircularProgress, Button, Divider, Tooltip 
} from '@mui/material';
import { 
  MdSend, MdPayment, MdPerson, MdClose, MdRefresh, 
  MdImage, MdCheck, MdErrorOutline 
} from 'react-icons/md';
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

interface MessageItem {
  _id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  text: string;
  isPaymentLink?: boolean;
  createdAt: string;
  isPending?: boolean;
  isFailed?: boolean;
}

export default function OrderChat({ orderId, onClose, stripeUrl, isStaff, customerName, projectName }: Props) {
  const { data: session } = useSession();
  const t = useTranslations('Chat');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUserId = (session?.user as any)?.id;

  // Handle scroll position to prevent jumping when user reads old history
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      setIsNearBottom(distanceToBottom < 120);
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    }
  };

  const fetchMessages = useCallback(async (isInitial = false) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/messages`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => {
          // Keep pending local messages if any
          const pendingMsgs = prev.filter((m) => m.isPending || m.isFailed);
          const serverIds = new Set(data.map((m: MessageItem) => m._id));
          const filteredPending = pendingMsgs.filter((m) => !serverIds.has(m._id));
          return [...data, ...filteredPending];
        });

        if (isInitial || isNearBottom) {
          setTimeout(() => scrollToBottom(isInitial ? 'auto' : 'smooth'), 50);
        }
      }
    } catch (err) {
      console.error('Chat fetch error:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [orderId, isNearBottom]);

  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(false), 2500); // Fast 2.5s polling
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSend = async (e?: React.FormEvent, isPay = false) => {
    if (e) e.preventDefault();
    const msgText = isPay ? (t('paySent') || 'إرسال رابط الدفع') : text.trim();
    if (!msgText && !isPay) return;

    const tempId = `temp-${Date.now()}`;
    const newTempMsg: MessageItem = {
      _id: tempId,
      orderId,
      senderId: currentUserId || 'local',
      senderName: session?.user?.name || 'You',
      text: msgText,
      isPaymentLink: isPay,
      createdAt: new Date().toISOString(),
      isPending: true,
    };

    // Optimistic UI Update: Add message immediately to list and clear input
    setMessages((prev) => [...prev, newTempMsg]);
    if (!isPay) setText('');
    setSending(true);

    setTimeout(() => scrollToBottom('smooth'), 30);

    try {
      const res = await fetch(`/api/orders/${orderId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: msgText, 
          isPaymentLink: isPay 
        }),
      });

      if (res.ok) {
        const savedMsg = await res.json();
        setMessages((prev) => prev.map((m) => (m._id === tempId ? savedMsg : m)));
      } else {
        setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, isPending: false, isFailed: true } : m)));
      }
    } catch (err) {
      console.error('Send error:', err);
      setMessages((prev) => prev.map((m) => (m._id === tempId ? { ...m, isPending: false, isFailed: true } : m)));
    } finally {
      setSending(false);
    }
  };

  const isImageUrl = (url: string) => {
    return typeof url === 'string' && (url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null || url.startsWith('https://images.unsplash.com'));
  };

  return (
    <Paper 
      elevation={24} 
      className="flex flex-col h-[85vh] sm:h-[620px] max-h-[90vh] w-full max-w-full sm:max-w-lg bg-neutral-950 text-white overflow-hidden rounded-2xl sm:rounded-3xl border border-venecos-gold/30 shadow-2xl transition-all"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-950 via-venecos-black to-neutral-900 p-4 border-b border-venecos-gold/20 flex justify-between items-center text-white shrink-0">
        <div className="flex items-center gap-3">
          <Avatar sx={{ bgcolor: '#D4AF37', color: '#000', fontWeight: 'bold', width: 38, height: 38 }}>
            <MdPerson className="text-xl" />
          </Avatar>
          <div>
            <h3 className="font-bold text-sm leading-tight text-white flex items-center gap-2">
              {projectName ? `${projectName}` : (t('orderChat') || 'محادثة الطلب')}
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-white/50 block font-mono">
              {customerName ? `${customerName} • ` : ''}ID: #{orderId.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip title="تحديث المحادثة">
            <IconButton size="small" onClick={() => fetchMessages(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <MdRefresh />
            </IconButton>
          </Tooltip>
          {onClose && (
            <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
              <MdClose />
            </IconButton>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-neutral-950 to-neutral-900 space-y-4 scroll-smooth"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-2">
            <CircularProgress size={28} sx={{ color: '#D4AF37' }} />
            <span className="text-xs">جاري تحميل المحادثة...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-2 text-center p-6">
            <div className="w-12 h-12 rounded-full bg-venecos-gold/10 border border-venecos-gold/30 text-venecos-gold flex items-center justify-center text-xl">
              💬
            </div>
            <p className="text-sm font-bold text-white/70">لا توجد رسائل بعد</p>
            <p className="text-xs text-white/40">اكتب رسالتك الأولى لبدء التواصل حول المشروعات والطلبات</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === currentUserId;
            return (
              <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`
                    max-w-[85%] rounded-2xl p-3.5 shadow-lg border text-xs leading-relaxed transition-all
                    ${isMe 
                      ? 'bg-gradient-to-r from-venecos-gold to-yellow-500 text-black font-semibold rounded-br-none border-venecos-gold' 
                      : 'bg-neutral-900/90 text-white rounded-bl-none border-white/10'
                    }
                  `}
                >
                  <div className="flex justify-between items-center gap-3 mb-1.5 border-b border-black/10 pb-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isMe ? 'text-black/80' : 'text-venecos-gold'}`}>
                      {m.senderName}
                    </span>
                    <span className={`text-[9px] ${isMe ? 'text-black/60' : 'text-white/40'}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {isImageUrl(m.text) ? (
                    <div className="my-2 rounded-xl overflow-hidden border border-black/20">
                      <img src={m.text} alt="Attachment" className="max-h-48 w-full object-cover" />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  )}

                  {m.isPaymentLink && stripeUrl && (
                    <div className="mt-3 pt-2 border-t border-black/10">
                      <Button 
                        variant="contained" 
                        fullWidth 
                        startIcon={<MdPayment />}
                        href={stripeUrl}
                        target="_blank"
                        sx={{ 
                          bgcolor: isMe ? '#000' : '#D4AF37', 
                          color: isMe ? '#D4AF37' : '#000',
                          borderRadius: 99, 
                          fontWeight: 'bold', 
                          fontSize: '0.75rem', 
                          py: 1,
                          '&:hover': { opacity: 0.9 }
                        }}
                      >
                        {t('completePayment') || 'استكمال الدفع عبر Stripe'}
                      </Button>
                    </div>
                  )}

                  {m.isPending && (
                    <div className="flex items-center gap-1 text-[9px] opacity-70 mt-1 justify-end">
                      <CircularProgress size={10} color="inherit" />
                      <span>جاري الإرسال...</span>
                    </div>
                  )}

                  {m.isFailed && (
                    <div className="flex items-center gap-1 text-[10px] text-red-700 font-bold mt-1 justify-end">
                      <MdErrorOutline /> فشل الإرسال
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Input controls */}
      <form onSubmit={handleSend} className="p-3 bg-neutral-900/90 border-t border-white/10 flex items-center gap-2 shrink-0">
        {isStaff && stripeUrl && (
          <Tooltip title="إرسال رابط الدفع المباشر للعميل">
            <IconButton 
              onClick={() => handleSend(undefined, true)} 
              disabled={sending} 
              sx={{ bgcolor: 'rgba(212,175,55,0.15)', color: '#D4AF37', '&:hover': { bgcolor: 'rgba(212,175,55,0.3)' } }}
            >
              <MdPayment />
            </IconButton>
          </Tooltip>
        )}

        <TextField 
          fullWidth 
          size="small" 
          placeholder={t('typeMessage') || 'اكتب رسالتك هنا...'} 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          disabled={sending}
          sx={{ 
            '& .MuiOutlinedInput-root': { 
              borderRadius: 99, 
              bgcolor: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '0.875rem',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
              '&:hover fieldset': { borderColor: '#D4AF37' },
              '&.Mui-focused fieldset': { borderColor: '#D4AF37' }
            } 
          }}
        />

        <IconButton 
          type="submit" 
          disabled={!text.trim() || sending} 
          sx={{ 
            bgcolor: '#D4AF37', 
            color: '#000', 
            '&:hover': { bgcolor: '#e8c96a' }, 
            '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' },
            p: 1.2
          }}
        >
          {sending ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <MdSend className={isRtl ? 'rotate-180 text-xl' : 'text-xl'} />
          )}
        </IconButton>
      </form>
    </Paper>
  );
}
