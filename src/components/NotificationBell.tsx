'use client';

import React, { useState, useEffect } from 'react';
import { 
  Badge, IconButton, Menu, MenuItem, ListItemText, 
  Typography, Divider, Box, CircularProgress 
} from '@mui/material';
import { MdNotifications, MdCircle } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
  const t = useTranslations('Notifications');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Notify error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkRead = async (id: string, link: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchNotifications();
      handleClose();
      router.push(link);
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <IconButton 
        onClick={handleOpen}
        sx={{ bgcolor: 'white', border: '1px solid #f0f0f0', borderRadius: '12px', p: 1.5 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <MdNotifications className="text-venecos-black" size={20} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { 
            width: 320, 
            mt: 1.5, 
            borderRadius: 4, 
            border: '1px solid #f0f0f0',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight="800">{t('title')}</Typography>
        </Box>
        <Divider />
        
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={24} /></Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
             <Typography variant="body2" color="textSecondary">{t('noNotifications')}</Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {notifications.map((n) => (
              <MenuItem 
                key={n._id} 
                onClick={() => handleMarkRead(n._id, n.link)}
                sx={{ 
                  py: 1.5, 
                  px: 2, 
                  borderBottom: '1px solid #f9f9f9',
                  bgcolor: n.isRead ? 'transparent' : 'rgba(212,175,55,0.03)'
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {!n.isRead && <MdCircle size={8} className="text-venecos-gold" />}
                      <Typography variant="body2" fontWeight={n.isRead ? 'normal' : 'bold'}>{n.title}</Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" color="textSecondary" display="block">{n.message}</Typography>
                      <Typography variant="caption" sx={{ fontSize: '9px', opacity: 0.5 }}>{new Date(n.createdAt).toLocaleString()}</Typography>
                    </>
                  }
                />
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>
    </>
  );
}
