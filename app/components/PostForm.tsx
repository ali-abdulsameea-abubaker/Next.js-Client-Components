// StAuth10222: I Ali Abubaker, 000857347 certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. 
// I have not made my work available to anyone else.

'use client';

import { useState } from 'react';
import { CreatePostRequest } from '../type';

interface PostFormProps {
  onPostCreated: (post: CreatePostRequest) => void;
}

interface FormErrors {
  content?: string;
  author?: string;
  category?: string;
  image?: string;
}

/**
 * Using the PostForm component to create new posts and upload images
 */
export default function PostForm({ onPostCreated }: PostFormProps) {
  const [formData, setFormData] = useState<CreatePostRequest>({
    content: '',
    author: '',
    category: 'general',
    imageUrl: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    else if (formData.content.trim().length < 10) {
      newErrors.content = 'The minimum length of the content is 10 characters.';
    }
    else if (formData.content.trim().length > 500) {
      newErrors.content = 'Less than 500 characters must be used in the content.';
    }
    else if (formData.content.trim().split(' ').length < 2) {
      newErrors.content = 'Content must contain at least 2 words';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author name required';
    }
    else if (formData.author.trim().length < 3) {
      newErrors.author = 'The authors name ought to contain at least three characters.';
    }
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.author)) {
      newErrors.author = 'The author may only use underscores, digits, and letters.';
    }
    else if (formData.author.trim().length > 20) {
      newErrors.author = 'Author name must be less than 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category required';
    }
    else if (!['general', 'cats', 'turtles', 'frogs'].includes(formData.category)) {
      newErrors.category = 'Please select a valid category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Select an image file' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: undefined }));
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:4000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onPostCreated(formData);
        setFormData({ 
          content: '', 
          author: '', 
          category: 'general',
          imageUrl: ''
        });
        setImagePreview(null);
        setErrors({});
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setErrors({ content: 'The post could not be created.  Please give it another go.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Create New Post</h2>
      
      <div className="form-group">
        <label htmlFor="content" className="form-label">Content</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="form-textarea"
          placeholder="What's on your mind?"
        />
        {errors.content && <div className="form-error">{errors.content}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="author" className="form-label">Author</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="form-input"
          placeholder="username"
        />
        {errors.author && <div className="form-error">{errors.author}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="category" className="form-label">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="form-select"
        >
          <option value="general">General</option>
          <option value="cats">Cats</option>
          <option value="turtles">Turtles</option>
          <option value="frogs">Frogs</option>
        </select>
        {errors.category && <div className="form-error">{errors.category}</div>}
      </div>

      {/* Image Upload Section */}
      <div className="form-group">
        <label htmlFor="image" className="form-label">Image (Optional)</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageUpload}
          className="form-input"
          style={{ padding: '12px' }}
        />
        {errors.image && <div className="form-error">{errors.image}</div>}
        
        {/* Image Preview */}
        {imagePreview && (
          <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ 
                maxWidth: '200px', 
                maxHeight: '200px', 
                borderRadius: '8px',
                border: '2px solid var(--border)'
              }} 
            />
            <button
              type="button"
              onClick={removeImage}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}