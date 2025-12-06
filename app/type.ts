// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

/**
 * symbolizes a post on social media
 */
export interface Post {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  category: 'cats' | 'turtles' | 'frogs' | 'general';
  isBookmarked?: boolean;
  comments?: Comment[];
}

/**
 * represents a post's comment
 */
export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  timestamp: string;
}

/**
 * Type of request to create a new post
 */
export type CreatePostRequest = Omit<Post, 'id' | 'timestamp' | 'likes'>;