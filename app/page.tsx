// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Post, CreatePostRequest } from './type';
import PostForm from './components/PostForm';
import PostCard from './components/PostCard';
import ThemeToggle from './components/ThemeToggle';
import SearchBar from './components/SearchBar';
import ToastContainer, { useToast } from './components/ToastContainer';
import PostSkeleton from './components/PostSkeleton';

/**
 * Home component: the application's home page
 */
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'most-liked' | 'most-commented'>('recent');
  const searchParams = useSearchParams();
  
  const urlSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm);
  const [activeFilter, setActiveFilter] = useState<'all' | 'cats' | 'turtles' | 'frogs' | 'general'>('all');

  const { toasts, addToast } = useToast();

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:4000/posts');
      
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const postsData = await res.json();
      setPosts(postsData);
      addToast('Posts have successfully loaded!', 'success');
    } catch (error) {
      console.error('Error fetch the posts:', error);
      addToast('Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;

    if (activeFilter !== 'all') {
      result = result.filter(post => post.category === activeFilter);
    }

    if (searchTerm) {
      result = result.filter(post => 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    const sortedResult = [...result].sort((a, b) => {
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

    setFilteredPosts(sortedResult);
  }, [posts, activeFilter, searchTerm, sortBy]);

  useEffect(() => {
    setSearchTerm(urlSearchTerm);
  }, [urlSearchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      setActiveFilter('all');
      addToast(`Search for: ${term}`, 'info');
    }
  };

  const handleFilter = (filter: 'all' | 'cats' | 'turtles' | 'frogs' | 'general') => {
    setActiveFilter(filter);
    setSearchTerm('');
    
    const url = new URL(window.location.href);
    url.searchParams.delete('search');
    window.history.pushState({}, '', url.toString());
    
    addToast(`Filtered by: ${filter}`, 'info');
  };

  const handleSort = (sort: 'recent' | 'most-liked' | 'most-commented') => {
    setSortBy(sort);
    addToast(`Sorted by: ${sort.replace('-', ' ')}`, 'info');
  };

  const handlePostCreated = () => {
    fetchPosts();
    addToast('Post has been created successfully!', 'success');
  };

  const clearFilters = () => {
    setActiveFilter('all');
    setSearchTerm('');
    setSortBy('recent');
    
    const url = new URL(window.location.href);
    url.searchParams.delete('search');
    window.history.pushState({}, '', url.toString());
    
    addToast('All filters cleared', 'info');
  };

  const refreshPosts = () => {
    setLoading(true);
    fetchPosts();
    addToast('Refreshing posts...', 'info');
  };

  if (loading) {
    return (
      <div className="container">
        <ThemeToggle />
        <div className="header">
          <h1>Pet Social 🐾</h1>
          <p style={{ textAlign: 'center', marginBottom: '16px', color: '#94a3b8' }}>
            Share your pet moments with the world!
          </p>
        </div>
        <div className="posts-grid">
          {[...Array(3)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <ThemeToggle />
      
      <div className="header">
        <h1>Pet Social 🐾</h1>
        <p style={{ textAlign: 'center', marginBottom: '16px', color: '#94a3b8' }}>
          Share your pet moments with the world!
        </p>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <button 
            onClick={refreshPosts}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            Refresh
          </button>
          {/* <a 
            href="/posts"
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            All Posts
          </a> */}
        </div>

        {/* Sort Controls */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>Sort by:</span>
          <button 
            onClick={() => handleSort('recent')}
            className={`btn ${sortBy === 'recent' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            Recent
          </button>
          <button 
            onClick={() => handleSort('most-liked')}
            className={`btn ${sortBy === 'most-liked' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            Most Liked
          </button>
          <button 
            onClick={() => handleSort('most-commented')}
            className={`btn ${sortBy === 'most-commented' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            Most Comments
          </button>
        </div>
        
        {/* the Category Filter Buttons */}
        <nav className="nav">
          <button 
            onClick={() => handleFilter('all')}
            className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Posts
          </button>
          <button 
            onClick={() => handleFilter('cats')}
            className={`btn ${activeFilter === 'cats' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Cats
          </button>
          <button 
            onClick={() => handleFilter('turtles')}
            className={`btn ${activeFilter === 'turtles' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Turtles
          </button>
          <button 
            onClick={() => handleFilter('frogs')}
            className={`btn ${activeFilter === 'frogs' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Frogs
          </button>
          <button 
            onClick={() => handleFilter('general')}
            className={`btn ${activeFilter === 'general' ? 'btn-primary' : 'btn-secondary'}`}
          >
            General
          </button>
        </nav>

        {/* Searching Bar */}
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search posts or users..."
          initialSearch={searchTerm}
        />

        {/* The Display of Active Filters */}
        {(activeFilter !== 'all' || searchTerm || sortBy !== 'recent') && (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: 'var(--surface)', 
            borderRadius: '8px',
            border: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-muted)' }}>Active filters: </span>
              {activeFilter !== 'all' && (
                <span className="post-category">
                  {activeFilter}
                </span>
              )}
              {searchTerm && (
                <span className="post-category" style={{ background: '#10b981' }}>
                  Search: "{searchTerm}"
                </span>
              )}
              {sortBy !== 'recent' && (
                <span className="post-category" style={{ background: '#8b5cf6' }}>
                  Sort: {sortBy.replace('-', ' ')}
                </span>
              )}
            </div>
            <button 
              onClick={clearFilters}
              className="btn btn-secondary"
              style={{ padding: '4px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      <PostForm onPostCreated={handlePostCreated} />
      
      <div className="posts-grid">
        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No posts found</h3>
            <p>
              {searchTerm 
                ? `No posts matching "${searchTerm}"`
                : activeFilter !== 'all'
                ? `No ${activeFilter} posts yet`
                : 'No posts as of yet.  Make the first one!'
              }
            </p>
            {(searchTerm || activeFilter !== 'all' || sortBy !== 'recent') && (
              <button 
                onClick={clearFilters}
                className="btn btn-primary"
                style={{ marginTop: '12px' }}
              >
                Show All Posts
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ 
              color: 'var(--text-muted)', 
              fontSize: '14px', 
              marginBottom: '16px',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <span>
                Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
                {activeFilter !== 'all' && ` in ${activeFilter}`}
                {searchTerm && ` matching "${searchTerm}"`}
                {` • Sorted by ${sortBy.replace('-', ' ')}`}
              </span>
            </div>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}