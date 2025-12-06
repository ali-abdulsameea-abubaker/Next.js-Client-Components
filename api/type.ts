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
  authorAvatar: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  category: 'cats' | 'turtles' | 'frogs' | 'general';
  imageUrl?: string;
  isBookmarked: boolean;
}

/**
 * symbolizes a post's comment
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
export type CreatePostRequest = Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'isBookmarked'>;

/**
 * Type of request to update an already-published post
 */
export type UpdatePostRequest = Partial<Pick<Post, 'likes' | 'isBookmarked'>>;

/**
 * Type of request for adding a new comment
 */
export type CreateCommentRequest = Omit<Comment, 'id' | 'timestamp'>;

/**
 * Post sorting options that are available
 */
export type PostSort = 'most-liked' | 'recent' | 'most-commented';