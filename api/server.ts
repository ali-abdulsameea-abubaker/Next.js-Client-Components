// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

import express from 'express';
import cors from 'cors';
import { Database } from './database';
import { CreatePostRequest, UpdatePostRequest, CreateCommentRequest, PostSort } from './type';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

/**
 * API information provided by the root endpoint
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'The improved social media API is operational!',
    version: '2.0',
    features: ['Posts', 'Comments', 'Likes', 'Bookmarks', 'Search', 'User Avatars', 'Delete Posts'],
    endpoints: {
      'GET /posts': 'Getting all posts (optional ?category=filter&search=term&sort=type)',
      'POST /posts': 'Create a new post',
      'PATCH /posts/:id': 'Update a post',
      'DELETE /posts/:id': 'Delete a post',
      'GET /posts/:id': 'Get a single post',
      'POST /comments': 'Add a comment',
      'GET /avatar': 'Get random avatar'
    }
  });
});

/**
 * Obtain every post with options sorting and filtering
 */
app.get('/posts', (req, res) => {
  const category = req.query.category as string;
  const search = req.query.search as string;
  const sort = req.query.sort as PostSort;
  
  let posts = Database.getPosts(category, search);
  
  if (sort === 'most-liked') {
    posts = posts.sort((a, b) => b.likes - a.likes);
  } else if (sort === 'recent') {
    posts = posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } else if (sort === 'most-commented') {
    posts = posts.sort((a, b) => b.comments.length - a.comments.length);
  }
  
  res.json(posts);
});

/**
 * Creating the new post
 */
app.post('/posts', (req, res) => {
  try {
    const postData: CreatePostRequest = req.body;
    
    if (!postData.content || !postData.author) {
      return res.status(400).json({ error: 'Author and content are necessary' });
    }
    
    if (!postData.authorAvatar) {
      postData.authorAvatar = Database.getRandomAvatar();
    }
    
    const newPost = Database.createPost(postData);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Updating an existing post
 */
app.patch('/posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates: UpdatePostRequest = req.body;
    
    const updatedPost = Database.updatePost(id, updates);
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Deleting post by ID
 */
app.delete('/posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const success = Database.deletePost(id);
    if (!success) {
      return res.status(404).json({ error: 'Post is not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * obtaing the single post by ID
 */
app.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  const post = Database.getPost(id);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json(post);
});

/**
 * Adding a comment to a post
 */
app.post('/comments', (req, res) => {
  try {
    const commentData: CreateCommentRequest = req.body;
    
    if (!commentData.postId || !commentData.author || !commentData.content) {
      return res.status(400).json({ error: 'you are missing required fields' });
    }
    
    const newComment = Database.addComment(commentData);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * obtaining a random avatar
 */
app.get('/avatar', (req, res) => {
  const avatar = Database.getRandomAvatar();
  res.json({ avatar });
});

app.listen(PORT, () => {
  console.log(`Improved API server operating on http://localhost:4000`);
  console.log(`DELETING endpoint: http://localhost:4000/posts/:id`);
});