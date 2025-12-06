// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

import { Post } from '../../type';
import PostList from '../../components/PostList';

/**
 * retrieves posts with optional category filtering from the API
 */
async function getPosts(category: string): Promise<Post[]> {
  const url = category === 'all' 
    ? 'http://localhost:4000/posts'
    : `http://localhost:4000/posts?category=${category}`;
  
  const res = await fetch(url, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}

interface FilterPageProps {
  params: {
    category: string;
  };
}

/**
 * Posts filtered by category are displayed using the FilterPage component.
 */
export default async function FilterPage({ params }: FilterPageProps) {
  const posts = await getPosts(params.category);

  return (
    <div className="container">
      <div className="header">
        <h1>Filtered Posts: {params.category}</h1>
        
        <nav className="nav">
          <a href="/filter/all" className="btn btn-secondary">All</a>
          <a href="/filter/cats" className="btn btn-secondary">Cats</a>
          <a href="/filter/turtles" className="btn btn-secondary">Turtles</a>
          <a href="/filter/frogs" className="btn btn-secondary">Frogs</a>
          <a href="/" className="btn btn-primary">Back to Home</a>
        </nav>
      </div>
      
      <PostList posts={posts} />
    </div>
  );
}