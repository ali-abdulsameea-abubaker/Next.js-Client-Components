// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

import { Post, Comment } from './type';

const avatars = [
  '🐱', '🐶', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮',
  '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄', '🐲', '🐙',
  '🐬', '🐳', '🦈', '🐊', '🐢', '🐍', '🦎', '🐘', '🦒', '🦘',
  '🐫', '🦏', '🦛', '🐃', '🐂', '🐎', '🦌', '🐐', '🐏', '🐑',
  '🐕', '🐩', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🐇',
  '🐱', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
  '🐈', '🐈‍⬛', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄',
  '🦓', '🐢', '🐢', '🐢', '🐢', '🐢', 
  '🦎', '🐊', '🐍', '🐲', '🐉', '🐳', '🦈', '🐠', '🐟', '🦐',
];

let posts: Post[] = [
  {
    id: '1',
    content: 'I recently adopted this cute kitty! Introducing Whiskers 🐱❤️ #catlove',
    author: 'cat_lover',
    authorAvatar: '🐱',
    timestamp: new Date().toISOString(),
    likes: 15,
    comments: [
      {
        id: 'c1',
        postId: '1',
        author: 'animal_friend',
        content: 'So cute! Where did you adopt from?',
        timestamp: new Date().toISOString()
      }
    ],
    category: 'cats',
    imageUrl: '/api/placeholder/400/300',
    isBookmarked: false
  },
  {
    id: '2',
    content: 'Sheldon, my turtle, is having fun in the sun today! 🐢☀️  Despite his slowness, he has the largest personality!',
    author: 'turtle_fan',
    authorAvatar: '🐢',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 8,
    comments: [],
    category: 'turtles',
    isBookmarked: false
  },
  {
    id: '3',
    content: 'What amazing jumpers frogs are!  Some frogs can jump more than 20 times their body length, in case you were unaware.  🐸💨 #amphibianfacts',
    author: 'frog_enthusiast',
    authorAvatar: '🐸',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 12,
    comments: [
      {
        id: 'c2',
        postId: '3',
        author: 'science_geek',
        content: 'Thats incredible!  The natural world is amazing',
        timestamp: new Date().toISOString()
      }
    ],
    category: 'frogs',
    isBookmarked: false
  }
];

let comments: Comment[] = [
  {
    id: 'c1',
    postId: '1',
    author: 'animal_friend',
    content: 'Adorable!  From where did you adopt?',
    timestamp: new Date().toISOString()
  },
  {
    id: 'c2',
    postId: '3',
    author: 'science_geek',
    content: 'Thats incredible!  The natural world is amazing.',
    timestamp: new Date().toISOString()
  }
];

/**
 * Post and comment management database class
 */
export class Database {
  /**
   * Obtain every post with the opportunity to filter by search phrase and category.
   */
  static getPosts(category?: string, search?: string): Post[] {
    let filteredPosts = posts;
    
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    
    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.content.toLowerCase().includes(search.toLowerCase()) ||
        post.author.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filteredPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Creating a new post
   */
  static createPost(post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'isBookmarked'>): Post {
    const newPost: Post = {
      ...post,
      id: (posts.length + 1).toString(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      isBookmarked: false
    };
    posts.unshift(newPost);
    return newPost;
  }

  /**
   * Deleting a post by ID
   */
  static deletePost(id: string): boolean {
    const index = posts.findIndex(post => post.id === id);
    if (index === -1) return false;
    
    posts.splice(index, 1);
    
    const commentIndices = comments
      .map((comment, index) => comment.postId === id ? index : -1)
      .filter(index => index !== -1)
      .reverse();
  
    for (const index of commentIndices) {
      comments.splice(index, 1);
    }
    
    return true;
  }

  /**
   * Updating a post by ID
   */
  static updatePost(id: string, updates: Partial<Post>): Post | null {
    const index = posts.findIndex(post => post.id === id);
    if (index === -1) return null;
    
    posts[index] = { ...posts[index], ...updates };
    return posts[index];
  }

  /**
   * Getting a single post by ID
   */
  static getPost(id: string): Post | null {
    return posts.find(post => post.id === id) || null;
  }

  /**
   * Adding a new comment
   */
  static addComment(commentData: Omit<Comment, 'id' | 'timestamp'>): Comment {
    const newComment: Comment = {
      ...commentData,
      id: `c${comments.length + 1}`,
      timestamp: new Date().toISOString()
    };
    comments.push(newComment);
    
    const postIndex = posts.findIndex(post => post.id === commentData.postId);
    if (postIndex !== -1) {
      posts[postIndex].comments.push(newComment);
    }
    
    return newComment;
  }

  /**
   * obtain whole comments
   */
  static getComments(postId: string): Comment[] {
    return comments.filter(comment => comment.postId === postId);
  }

  /**
   * Choose an avatar at random from the selection.
   */
  static getRandomAvatar(): string {
    return avatars[Math.floor(Math.random() * avatars.length)];
  }
}