// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

import { Post } from '../../type';
import PostCard from '../../components/PostCard';
import ThemeToggle from '../../components/ThemeToggle';

/**
 * retrieves a single post from the API using its ID
 */
async function getPost(id: string): Promise<Post | null> {
  try {
    const res = await fetch(`http://localhost:4000/posts/${id}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetch the post:', error);
    return null;
  }
}

interface PostPageProps {
  params: {
    id: string;
  };
}

/**
 * PostPage component to show specific post information.
 */
export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.id);

  if (!post) {
    return (
      <div className="container">
        <ThemeToggle />
        <div className="empty-state">
          <div className="icon">❌</div>
          <h3>Post Not Found</h3>
          <p>There isn't a post that you are looking for.</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: '12px' }}>
            ← Back to Home
          </a>
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
          Post Details
        </p>
        <a href="/" className="btn btn-secondary">
          ← Back to All Posts
        </a>
      </div>

      <PostCard post={post} />
    </div>
  );
}