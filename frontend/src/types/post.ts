import { User } from './auth';

export interface Post {
  id: string;
  content: string;
  image_url?: string;
  user_id: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  attachments?: any;
}

export interface Comment {
  id: number;
  content: string;
  post_id: number;
  author_id: number;
  author: User;
  created_at: string;
}

export interface CreatePostData {
  content: string;
  image_url?: string;
}

export interface CreateCommentData {
  content: string;
  post_id: number;
}