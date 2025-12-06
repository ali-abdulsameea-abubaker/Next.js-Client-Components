// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

'use client';

import { useState, useEffect } from 'react';
import { Post } from '../type';
import PostList from '../components/PostList';

/**
 * PostsPage component for sorting and showing every post
 */
export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'most-liked' | 'most-commented'>('recent');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('http://localhost:4000/posts', {
          cache: 'no-store',
        });
        
        if (!res.ok) {
          throw new Error('Failed for fetching posts');
        }
        
        const postsData = await res.json();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetch the posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const handleSort = (sort: 'recent' | 'most-liked' | 'most-commented') => {
    setSortBy(sort);
  };

  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'most-liked':
        return b.likes - a.likes;
      case 'most-commented':
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return <div className="container">Loading posts....</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>All Posts</h1>
        <nav className="nav">
          <a href="/" className="btn btn-secondary">Back to Home</a>
        </nav>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>Sort by:</span>
        <button 
          onClick={() => handleSort('recent')}
          className={`btn ${sortBy === 'recent' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          🕒 Recent
        </button>
        <button 
          onClick={() => handleSort('most-liked')}
          className={`btn ${sortBy === 'most-liked' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          ❤️ Most Liked
        </button>
        <button 
          onClick={() => handleSort('most-commented')}
          className={`btn ${sortBy === 'most-commented' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          💬 Most Comments
        </button>
      </div>
      
      <PostList posts={sortedPosts} />
    </div>
  );
}