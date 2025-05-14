import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Option } from '../types';
import Select from 'react-select';
import '../css/CreatePost.css';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';


// Define props interface for CreatePost component
interface CreatePostProps {
  user: User | null;
  isAuthenticated: boolean;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, isAuthenticated }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string; } | null>(null);
  const [options, setOptions] = useState<Option[]>([
    {id:1, url: ''},
    {id:2, url: ''}
  ]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'color': []}, {'background': []}],
      [{'align': []}],
      ['link', 'image'],
      ['clean']
    ],
  };

  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }


  const dropdownOptions = [
    { value: 'choose', label: 'Help me choose one' },
    { value: 'look', label: 'How do I look?' },
  ];

  const handleOptionChange = (index: number, field: keyof Option, value: string): void => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const addOption = (): void => {
    if (options.length < 5) { // Limit to 5 options
      setOptions([...options, {id:3, url: '' }]);
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
      
      <label htmlFor="post-type">Post Type</label>
        <div className="form-group">
        <Select
        id="post-type"
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={dropdownOptions}
      />
      </div>


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
        

        <div className="form-group">
          <label htmlFor="title">Description</label>
          <ReactQuill 
        theme="snow" 
        value={description} 
        onChange={setDescription} 
        modules={modules}
      />
        </div>

        <h3>Options</h3>
        <div className='option-container'>
        {options.map((option, index) => (
          <div key={index} className="option-form">
            <h4>Option {index + 1}</h4>
            <div className="form-group">
              <label>URL</label>
              <input
                type="url"
                value={option.url}
                onChange={(e) => handleOptionChange(index, 'url', e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
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

</div>
        
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