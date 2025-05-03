import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Option } from '../types';


// Define props interface for CreatePost component
interface CreatePostProps {
  user: User | null;
  isAuthenticated: boolean;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, isAuthenticated }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [options, setOptions] = useState<Option[]>([
    {id:1, imageUrl: '', description: '', price: 0, store: '', url: '', hasUserVoted:false, votes:2 },
    {id:2, imageUrl: '', description: '', price: 0, store: '', url: '', hasUserVoted:false, votes:10 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleOptionChange = (index: number, field: keyof Option, value: string): void => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const addOption = (): void => {
    if (options.length < 5) { // Limit to 5 options
      setOptions([...options, {id:3, imageUrl: '', description: '', price: 0, store: '', url: '', hasUserVoted:false, votes:2 }]);
    }
  };

  const removeOption = (index: number): void => {
    if (options.length > 2) { // Require at least 2 options
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate form
      if (!title.trim()) {
        throw new Error('Please enter a title');
      }

      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (!option.imageUrl || !option.description) {
          throw new Error(`Please fill in all required fields for option ${i + 1}`);
        }
      }

      // In a real app, you would call the API here
      // if (user) {
      //   const newPost = await createPost({ 
      //     title, 
      //     options, 
      //     userId: user.id 
      //   });
      // }
      
      // For demo, simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/');
      }, 1000);
      
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-page">
      <h2>Create a New Post</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Which dress should I buy?"
            required
          />
        </div>
        
        <h3>Options</h3>
        {options.map((option, index) => (
          <div key={index} className="option-form">
            <h4>Option {index + 1}</h4>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={option.imageUrl}
                onChange={(e) => handleOptionChange(index, 'imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={option.description}
                onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                placeholder="E.g., Blue floral dress"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Price (optional)</label>
                <input
                  type="number"
                  value={option.price}
                  onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                  placeholder="E.g., 49.99"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Store (optional)</label>
                <input
                  type="text"
                  value={option.store}
                  onChange={(e) => handleOptionChange(index, 'store', e.target.value)}
                  placeholder="E.g., Zara"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Product URL (optional)</label>
              <input
                type="url"
                value={option.url}
                onChange={(e) => handleOptionChange(index, 'url', e.target.value)}
                placeholder="https://example.com/product"
              />
            </div>
            
            {options.length > 2 && (
              <button 
                type="button" 
                className="remove-option-btn"
                onClick={() => removeOption(index)}
              >
                Remove Option
              </button>
            )}
          </div>
        ))}
        
        {options.length < 5 && (
          <button 
            type="button" 
            className="add-option-btn"
            onClick={addOption}
          >
            Add Another Option
          </button>
        )}
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;