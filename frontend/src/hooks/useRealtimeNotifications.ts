import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useSupabase';
import { useNotifications } from './useNotifications';

export function useRealtimeNotifications() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user) return;

    // Subscribe to new posts
    const postsChannel = supabase
      .channel('posts-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts'
      }, (payload) => {
        const newPost = payload.new;
        if (newPost.user_id !== user.id) {
          addNotification('📝 New post shared!', 'info');
        }
      })
      .subscribe();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('messages-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const newMessage = payload.new;
        if (newMessage.receiver_id === user.id) {
          addNotification('💬 New message received!', 'info');
        }
      })
      .subscribe();

    // Subscribe to new follows
    const followsChannel = supabase
      .channel('follows-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'follows'
      }, (payload) => {
        const newFollow = payload.new;
        if (newFollow.following_id === user.id) {
          addNotification('👥 Someone followed you!', 'success');
        }
      })
      .subscribe();

    // Subscribe to new users
    const usersChannel = supabase
      .channel('users-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'profiles'
      }, (payload) => {
        const newUser = payload.new;
        if (newUser.id !== user.id) {
          addNotification('🎓 New student joined!', 'info');
        }
      })
      .subscribe();

    return () => {
      postsChannel.unsubscribe();
      messagesChannel.unsubscribe();
      followsChannel.unsubscribe();
      usersChannel.unsubscribe();
    };
  }, [user, addNotification]);
}