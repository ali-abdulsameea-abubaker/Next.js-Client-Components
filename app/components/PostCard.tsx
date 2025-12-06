// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

'use client';

import { useState } from 'react';
import { Post } from '../type';
import PostInteractions from './PostInteractions';

interface PostCardProps {
  post: Post;
}

/**
 * PostCard element for showcasing specific posts
 */
export default function PostCard({ post }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const isLongContent = post.content.length > 150;
  const displayContent = isLongContent && !isExpanded
    ? `${post.content.substring(0, 150)}...`
    : post.content;

  return (
    <article className="post">
      <div className="post-header">
        <div className="avatar">
          {post.authorAvatar}
        </div>
        <div className="user-info">
          <div className="post-author">@{post.author}</div>
          <div className="post-timestamp">{formatTime(post.timestamp)}</div>
        </div>
        <span className="post-category">{post.category}</span>
      </div>

      <div className="post-content">
        {displayContent}
        {isLongContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontWeight: '600',
              marginLeft: '8px',
              fontSize: '14px'
            }}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>






      {post.imageUrl && (
        <div className="post-image">
          <img
            src={post.imageUrl}
            alt="Post content"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              maxHeight: '400px',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      <PostInteractions
        postId={post.id}
        initialLikes={post.likes}
        initialComments={post.comments}
        initialBookmarked={post.isBookmarked}
      />
    </article>
  );
}