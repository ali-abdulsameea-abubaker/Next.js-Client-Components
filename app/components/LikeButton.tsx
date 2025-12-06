// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

'use client';

import { useState } from 'react';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

/**
 * LikeButton element for managing likes on posts
 */
export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`http://localhost:4000/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likes: likes + 1 }),
      });

      if (response.ok) {
        setLikes(prev => prev + 1);
      } else {
        throw new Error('Failed to update likes');
      }
    } catch (error) {
      // console.error('Error updating likes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="like-section">
      <button 
        onClick={handleLike} 
        className="like-btn"
        disabled={isLoading}
      >
        {isLoading ? '...' : '❤️ Like'}
      </button>
      <span className="like-count">{likes} likes</span>
    </div>
  );
}