// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

'use client';

import { useState, useEffect } from 'react';
import { Comment } from '../type';

interface PostInteractionsProps {
  postId: string;
  initialLikes: number;
  initialComments?: Comment[];
  initialBookmarked: boolean;
}

/**
 * To handle post interactions, use the PostInteractions component.
 */
export default function PostInteractions({ 
  postId, 
  initialLikes, 
  initialComments = [],
  initialBookmarked 
}: PostInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const syncLikes = async () => {
      try {
        const response = await fetch(`http://localhost:4000/posts/${postId}`);
        if (response.ok) {
          const post = await response.json();
          if (post.likes !== likes) {
            setLikes(post.likes);
          }
        }
      } catch (error) {
        console.error('Error syncing likes:', error);
      }
    };

    const interval = setInterval(syncLikes, 10000);
    
    return () => clearInterval(interval);
  }, [postId, likes]);

  const handleLike = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: isLiked ? likes - 1 : likes + 1 }),
      });

      if (response.ok) {
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await fetch(`http://localhost:4000/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBookmarked: !isBookmarked }),
      });

      if (response.ok) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      // console.error('Error updating bookmark:', error);
    }
  };

  const handleShare = async () => {
    try {
      const postUrl = `${window.location.origin}/posts/${postId}`;
      await navigator.clipboard.writeText(postUrl);
      
      setShowShareOptions(true);
      setTimeout(() => setShowShareOptions(false), 2000);
      
      console.log('Copy the post URL to your clipboard:', postUrl);
    } catch (error) {
      console.error('Error share a post:', error);
      const postUrl = `${window.location.origin}/posts/${postId}`;
      prompt('Coping this URL to share:', postUrl);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/posts/${postId}`, {
        method: 'DELETE',
      });

      console.log('Deleting response status:', response.status);
      
      if (response.status === 204) {
        console.log('Posting deleted successfully');
        window.location.reload();
      } else if (response.status === 404) {
        console.error('Posting not found');
        setError('Post cannot be located.  It might have been removed already.');
      } else {
        const errorData = await response.json();
        console.error('Deleting failed:', errorData);
        setError(`Failed to delete post: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('The server connection was unsuccessful.  Verify that port 4000 is being used by the backend.');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      console.log('I am requesting comments.');
      
      const response = await fetch('http://localhost:4000/comments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          postId,
          author: 'current_user',
          content: newComment.trim()
        }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const comment = await response.json();
        console.log('Comment created:', comment);
        setComments(prev => [...prev, comment]);
        setNewComment('');
        setError('');
      } else {
        const errorText = await response.text();
        console.error('Server error responding:', errorText);
        setError(`Failed to add comment: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('The server connection was unsuccessful.  Verify that port 4000 is being used by the backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div>
      <div className="post-actions">
        <button 
          onClick={handleLike}
          className={`action-btn ${isLiked ? 'active' : ''}`}
          disabled={isLoading}
        >
          ❤️ <span className="like-count">{likes}</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="action-btn"
        >
          💬 <span className="comment-count">{comments.length}</span>
        </button>
        
        <button 
          onClick={handleBookmark}
          className={`action-btn ${isBookmarked ? 'bookmarked' : ''}`}
        >
          {isBookmarked ? '🔖' : '📑'}
        </button>
        
        <button 
          onClick={() => setShowDeleteConfirm(true)}
          className="action-btn"
          title="Delete post"
          style={{ color: '#ef4444' }}
        >
          🗑️
        </button>
        
        <button 
          onClick={handleShare}
          className="action-btn"
          title="Share post"
          style={{ position: 'relative' }}
        >
          🔄
          {showShareOptions && (
            <div className="share-tooltip">
              Link copied!
            </div>
          )}
        </button>
      </div>

      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--surface)',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            maxWidth: '400px',
            margin: '20px'
          }}>
            <h3 style={{ marginBottom: '16px' }}>Delete Post?</h3>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
             Do you really want to remove this post?  There is no way to reverse this action.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="btn"
                style={{ background: '#ef4444', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showComments && (
        <div className="comments-section">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-avatar">
                {comment.author?.slice(0, 1) || 'U'}
              </div>
              <div className="comment-content">
                <div className="comment-author">@{comment.author}</div>
                <div className="comment-text">{comment.content}</div>
              </div>
            </div>
          ))}
          
          <div className="comment-form">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a comment..."
              className="comment-input"
              disabled={isLoading}
            />
            <button 
              onClick={handleAddComment}
              className="btn btn-primary"
              disabled={!newComment.trim() || isLoading}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
          
          {error && (
            <div style={{ 
              color: '#ef4444', 
              fontSize: '12px', 
              marginTop: '8px',
              padding: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '4px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}