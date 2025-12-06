// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

import { Post } from '../type';
import LikeButton from './LikeButton';

interface PostListProps {
  posts: Post[];
}

/**
 * To display a list of posts, use the PostList component.
 */
export default function PostList({ posts }: PostListProps) {
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <div className="post-header">
            <span className="post-author">{post.author}</span>
            <span className="post-timestamp">
              {new Date(post.timestamp).toLocaleDateString()}
            </span>
          </div>
          <div className="post-content">{post.content}</div>
          <div className="post-category">{post.category}</div>
          <LikeButton postId={post.id} initialLikes={post.likes} />
        </div>
      ))}
    </div>
  );
}