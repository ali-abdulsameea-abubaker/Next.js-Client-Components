// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Post search operation on the server
 */
export async function searchPosts(formData: FormData) {
  const search = formData.get('search') as string;
  
  if (search) {
    redirect(`/?search=${encodeURIComponent(search)}`);
  } else {
    redirect('/');
  }
}

/**
 * A server operation to generate fresh posts
 */
export async function createPost(formData: FormData) {
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;
  const category = formData.get('category') as string;

  await fetch('http://localhost:4000/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, author, category }),
  });

  revalidatePath('/');
}