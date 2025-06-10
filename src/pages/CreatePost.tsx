import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Option } from '../types';
import Select from 'react-select';
import '../css/CreatePost.css';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAuth } from '../context/AuthContext';
import api, { postService } from '../services/api';


const CreatePost = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string; } | null>(null);
  const [options, setOptions] = useState<Option[]>([
    {id:1, url: '', image: '', productName: '', siteName: ''},
    {id:2, url: '', image: '', productName: '', siteName: ''}
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


  const dropdownOptions = [
    { value: 'choose', label: 'Help me choose one' },
    { value: 'look', label: 'How do I look?' },
  ];

  const handleOptionChange = async (index: number, field: keyof Option, value: string) => {
    console.log(index, field, value);
    const newOptions = [...options];
    if(value){
      const response = await postService.getLinkPreview({url:value});
      console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
      console.log(response);
      console.log(response.title);
      newOptions[index] = {...newOptions[index], productName: response.title}
      newOptions[index] = {...newOptions[index], image: response.images[0]}
      newOptions[index] = {...newOptions[index], siteName: response.sitename}
    }
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
    
  };

  const addOption = (): void => {
    if (options.length < 5) { // Limit to 5 options
      setOptions([...options, {id:3, url: '', image: '', productName: '', siteName: '' }]);
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
      // setIsSubmitting(true);
      const optionsData = options.map((item)=>{
        return {url:item.url}
      })
      console.log(optionsData)
      const data = {
        title:title,
        description:description,
        postType: selectedOption?selectedOption.value: "choose",
        options:optionsData
      }
      const response = await postService.createPost(data);
      console.log(response);
      // setIsSubmitting(false);
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
              {option.image? <img style={{height:"200px", objectFit:"contain"}} alt='' src={option.image} />:null}
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