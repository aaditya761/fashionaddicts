import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  X, 
  Link,
  AlertCircle, 
  Loader2, 
  Image, 
  CheckCircle, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Zap, 
  ArrowRight, 
  Camera, 
  Star, 
  Shield, 
  Clock, 
  Award, 
  Flame, 
  Sparkle, 
  ChevronRight, Upload, ExternalLink, Info } from 'lucide-react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState([
    {id:1, url: '', image: '', productName: '', siteName: '', price: ''},
    {id:2, url: '', image: '', productName: '', siteName: '', price: ''}
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState({});
  const [activeStep, setActiveStep] = useState(1);
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [descCharCount, setDescCharCount] = useState(0);
  const [hoveredOption, setHoveredOption] = useState(0);
  const [animateSuccess, setAnimateSuccess] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const fileInputRef = useRef(null);

  const dropdownOptions = [
    { 
      value: 'choose', 
      label: 'Help me choose', 
      icon: '🤔', 
      description: 'Get community feedback on your decision',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-sky-50',
      stats: '85% get answers in 10 mins'
    },
    { 
      value: 'look', 
      label: 'How do I look?', 
      icon: '✨', 
      description: 'Share your style for honest opinions',
      color: 'from-pink-400 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50',
      stats: '92% positive engagement'
    },
    { 
      value: 'compare', 
      label: 'Compare options', 
      icon: '⚖️', 
      description: 'Let others help you decide between choices',
      color: 'from-purple-400 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      stats: 'Most popular category'
    },
  ];

  const popularTags = ['fashion', 'tech', 'home-decor', 'wedding', 'gifts', 'budget-friendly'];

  useEffect(() => {
    if (title && description && selectedOption) {
      setActiveStep(2);
    }
    if (title && description && selectedOption && options.filter(opt => opt.url).length >= 2) {
      setActiveStep(3);
    }
  }, [title, description, selectedOption, options]);

  useEffect(() => {
    if (success) {
      setAnimateSuccess(true);
      const timer = setTimeout(() => setAnimateSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleOptionChange = async (index: number, field: string, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
    
    if (field === 'url' && value && value.length > 10) {
      setLoadingOptions({ ...loadingOptions, [index]: true });
      setTimeout(() => {
        try {
          const hostname = new URL(value).hostname;
          const prices = ['$29.99', '$49.99', '$79.99', '$99.99', '$149.99'];
          newOptions[index] = {
            ...newOptions[index],
            productName: `Premium ${hostname.split('.')[0]} Product`,
            image: `https://picsum.photos/600/400?random=${Date.now() + index}`,
            siteName: hostname,
            price: prices[Math.floor(Math.random() * prices.length)]
          };
          setOptions(newOptions);
        } catch (e) {
          console.error('Invalid URL');
        }
        setLoadingOptions({ ...loadingOptions, [index]: false });
      }, 1500);
    }
  };

  const addOption = () => {
    if (options.length < 5) {
      const newId = Math.max(...options.map(o => o.id)) + 1;
      setOptions([...options, { id: newId, url: '', image: '', productName: '', siteName: '', price: '' }]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleImageUpload = (index: number) => {
    // Simulate image upload
    const newOptions = [...options];
    newOptions[index] = {
      ...newOptions[index],
      image: `https://picsum.photos/600/400?random=${Date.now() + index}`,
      productName: 'Uploaded Product'
    };
    setOptions(newOptions);
  };

  const addTag = () => {
    if (currentTag && tags && tags.length < 5 && !tags.includes(currentTag)) {
      setTags([...tags, currentTag.toLowerCase()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setOptions([
          {id:1, url: '', image: '', productName: '', siteName: '', price: ''},
          {id:2, url: '', image: '', productName: '', siteName: '', price: ''}
        ]);
        setTags([]);
        setSuccess(false);
        setActiveStep(1);
      }, 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-30 blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Floating shapes */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          >
            <div className={`w-2 h-2 ${i % 3 === 0 ? 'bg-blue-300' : i % 3 === 1 ? 'bg-purple-300' : 'bg-pink-300'} rounded-full opacity-20`}></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-pink-100 rounded-full text-gray-700 text-sm mb-6 shadow-sm">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-medium">Trending: Winter Fashion • Tech Gadgets • Home Essentials</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Create Something
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600"> Amazing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join 50,000+ members making better decisions together
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between relative">
              {[
                { number: 1, label: 'Details', icon: <Sparkles />, desc: 'Basic information' },
                { number: 2, label: 'Options', icon: <Image />, desc: 'Add your choices' },
                { number: 3, label: 'Preview', icon: <Eye />, desc: 'Review & publish' }
              ].map((step, index) => (
                <div key={step.number} className="flex-1 relative">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg
                        ${activeStep >= step.number 
                          ? 'bg-gradient-to-br from-violet-500 to-pink-500 text-white scale-110' 
                          : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                        }
                      `}>
                        {activeStep > step.number ? (
                          <CheckCircle className="w-8 h-8" />
                        ) : (
                          <div className="relative">
                            {React.cloneElement(step.icon, { className: 'w-6 h-6' })}
                            {activeStep === step.number && (
                              <div className="absolute inset-0 animate-ping">
                                {React.cloneElement(step.icon, { className: 'w-6 h-6 opacity-50' })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {activeStep === step.number && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className={`font-semibold ${activeStep >= step.number ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className="absolute top-8 left-[4rem] right-0 h-0.5 bg-gray-200">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-1000 shadow-sm"
                        style={{ width: activeStep > step.number ? '100%' : '0%' }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Card Header */}
          <div className="relative bg-gradient-to-r from-violet-600 to-pink-600 p-8">
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">New Post</h2>
                  <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
                    <span className="flex items-center gap-1">
                      <Shield className="w-4 h-4" /> Private until published
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Auto-save enabled
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <div className="text-center">
                  <p className="text-white/80 text-sm">Est. reach</p>
                  <p className="text-2xl font-bold text-white">10K+</p>
                </div>
                <div className="text-center">
                  <p className="text-white/80 text-sm">Avg. response</p>
                  <p className="text-2xl font-bold text-white">8 min</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-gray-50">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {success && (
              <div className={`mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl ${animateSuccess ? 'animate-slideIn' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="p-3 bg-green-100 rounded-2xl">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <Sparkle className="w-6 h-6 text-yellow-500 animate-spin" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-green-800">Success! Your post is live 🎉</h3>
                    <p className="text-green-600 mt-1">Already getting views from the community</p>
                    <div className="flex gap-3 mt-4">
                      <button className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2 font-medium shadow-md">
                        View Post <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="px-5 py-2.5 bg-white border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all font-medium">
                        Share with Friends
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="flex -space-x-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-10 h-10 bg-gradient-to-br from-violet-400 to-pink-400 rounded-full border-2 border-white shadow-md"></div>
                      ))}
                      <div className="w-10 h-10 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium shadow-md">
                        +8
                      </div>
                    </div>
                    <p className="text-xs text-green-600 mt-1 text-center">viewing now</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* Post Type Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-semibold text-gray-900">
                    What type of feedback do you need?
                  </label>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Required
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dropdownOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedOption(option.value)}
                      className={`
                        relative group p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden
                        ${selectedOption === option.value 
                          ? 'border-violet-500 bg-gradient-to-br ' + option.bgColor + ' shadow-lg scale-[1.02]' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="relative">
                        <div className="text-4xl mb-3">{option.icon}</div>
                        <h4 className="font-bold text-gray-900 mb-1">{option.label}</h4>
                        <p className="text-xs text-gray-600 mb-3">{option.description}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="w-3 h-3" />
                          <span>{option.stats}</span>
                        </div>
                        {selectedOption === option.value && (
                          <div className="absolute -top-1 -right-1">
                            <div className={`w-6 h-6 bg-gradient-to-br ${option.color} rounded-full flex items-center justify-center shadow-md`}>
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    Title
                    <Award className="w-4 h-4 text-yellow-500" />
                  </label>
                  <span className={`text-sm font-medium ${titleCharCount > 50 ? 'text-red-500' : titleCharCount > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {titleCharCount}/60
                  </span>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setTitleCharCount(e.target.value.length);
                    }}
                    placeholder="E.g., Which outfit for my job interview?"
                    className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all text-gray-900 placeholder-gray-400 pr-12 shadow-sm"
                    maxLength={60}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Sparkles className="w-5 h-5 text-gray-300 group-focus-within:text-violet-500 transition-colors" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Zap className="w-3 h-3 text-violet-500" />
                  <span>Pro tip: Questions get 2x more responses than statements</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-lg font-semibold text-gray-900">
                    Add Context
                  </label>
                  <span className={`text-sm font-medium ${descCharCount > 180 ? 'text-red-500' : descCharCount > 100 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {descCharCount}/200
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setDescCharCount(e.target.value.length);
                  }}
                  placeholder="Help the community understand your situation better..."
                  rows={4}
                  className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all text-gray-900 placeholder-gray-400 resize-none shadow-sm"
                  maxLength={200}
                />
              </div>

              {/* Tags Section */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-900">
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm flex items-center gap-2 border border-violet-200">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-violet-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {tags.length < 5 && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Add tag..."
                        className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-full text-sm text-gray-700 placeholder-gray-500 w-32 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTags.filter(tag => !tags.includes(tag)).map(tag => (
                    <button
                      key={tag}
                      onClick={() => setTags([...tags, tag])}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full text-xs transition-all"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Your Options</h3>
                    <p className="text-gray-600 mt-1">Add 2-5 choices for the community to vote on</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`
                            w-10 h-10 rounded-2xl border-2 border-white flex items-center justify-center text-sm font-bold transition-all shadow-md
                            ${i < options.filter(o => o.url).length 
                              ? 'bg-gradient-to-br from-violet-500 to-pink-500 text-white scale-110 z-10' 
                              : 'bg-gray-100 text-gray-400'
                            }
                          `}
                          style={{ zIndex: i < options.filter(o => o.url).length ? 10 - i : 0 }}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {options.map((option, index:number) => (
                    <div
                      key={option.id}
                      className="group relative"
                      onMouseEnter={() => setHoveredOption(index)}
                      onMouseLeave={() => setHoveredOption(0)}
                    >
                      <div className={`
                        absolute inset-0 bg-gradient-to-br from-violet-400/10 to-pink-400/10 rounded-3xl blur-xl transition-all duration-500
                        ${hoveredOption === index ? 'opacity-100 scale-105' : 'opacity-0 scale-95'}
                      `}></div>
                      
                      <div className="relative bg-white rounded-3xl p-6 border-2 border-gray-200 hover:border-violet-300 transition-all duration-300 shadow-md hover:shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {index + 1}
                              </div>
                              {option.url && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">Option {index + 1}</h4>
                              {option.price && (
                                <p className="text-sm text-violet-600 font-medium">{option.price}</p>
                              )}
                            </div>
                          </div>
                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>

                        {option.image ? (
                          <div className="mb-6 relative rounded-2xl overflow-hidden bg-gray-100 group-hover:shadow-lg transition-all duration-300">
                            <img
                              src={option.image}
                              alt={`Option ${index + 1}`}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <p className="text-white font-semibold text-lg">{option.productName}</p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 bg-white/30 backdrop-blur rounded-full"></div>
                                  <p className="text-white/80 text-sm">{option.siteName}</p>
                                </div>
                                <div className="flex items-center gap-3 text-white/60 text-sm">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" /> 0
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="w-4 h-4" /> 0
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="absolute top-3 right-3">
                              <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-gray-700 text-xs font-medium flex items-center gap-1 shadow-md">
                                <Camera className="w-3 h-3" />
                                Preview
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-6 relative">
                            <div className="h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center group-hover:border-violet-300 transition-colors">
                              {loadingOptions[index as keyof typeof loadingOptions] ? (
                                <div className="text-center">
                                  <div className="relative mb-4">
                                    <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto" />
                                    <div className="absolute inset-0 w-12 h-12 bg-violet-500/20 rounded-full animate-ping mx-auto"></div>
                                  </div>
                                  <p className="text-gray-700 font-medium">Fetching preview...</p>
                                  <p className="text-gray-500 text-sm mt-1">This won't take long</p>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <button
                                    onClick={() => handleImageUpload(index)}
                                    className="p-4 bg-violet-100 hover:bg-violet-200 rounded-2xl transition-all mb-3 group"
                                  >
                                    <Upload className="w-8 h-8 text-violet-600" />
                                  </button>
                                  <p className="text-gray-600 text-sm">Upload image or add URL below</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Link className="w-4 h-4 text-violet-600" />
                            Product URL
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              value={option.url}
                              onChange={(e) => handleOptionChange(index, 'url', e.target.value)}
                              placeholder="https://example.com/product"
                              className="w-full pl-4 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all text-gray-900 placeholder-gray-400"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <ExternalLink className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        {option.url && !option.image && !loadingOptions[index as keyof typeof loadingOptions] && (
                          <button
                            onClick={() => handleOptionChange(index, 'url', option.url)}
                            className="mt-3 text-xs text-violet-600 hover:text-violet-700 flex items-center gap-1 font-medium"
                          >
                            <ChevronRight className="w-3 h-3" />
                            Retry fetching preview
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {options.length < 5 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="w-full md:w-auto mx-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border-2 border-gray-300 text-gray-700 font-medium rounded-2xl transition-all duration-300 group shadow-md"
                  >
                    <div className="p-2 bg-white rounded-xl group-hover:rotate-180 transition-transform duration-500 shadow-sm">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span>Add Another Option</span>
                    <span className="text-gray-500">({5 - options.length} left)</span>
                  </button>
                )}
              </div>

              {/* Live Preview */}
              {activeStep === 3 && (
                <div className="p-8 bg-gradient-to-br from-violet-50 to-pink-50 rounded-3xl border-2 border-violet-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-md">
                      <Eye className="w-6 h-6 text-violet-600" />
                    </div>
                    Live Preview
                  </h3>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">{title || 'Your title here'}</h4>
                        <p className="text-gray-600">{description || 'Your description here'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-pink-400 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">You</p>
                          <p className="text-xs text-gray-500">Just now</p>
                        </div>
                      </div>
                    </div>
                    
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {options.filter(o => o.image).map((option, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden aspect-square">
                          <img src={option.image} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold text-2xl">{index + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-6 text-gray-500 text-sm">
                        <button className="flex items-center gap-2 hover:text-violet-600 transition-colors">
                          <Heart className="w-5 h-5" /> Like
                        </button>
                        <button className="flex items-center gap-2 hover:text-violet-600 transition-colors">
                          <MessageCircle className="w-5 h-5" /> Comment
                        </button>
                        <button className="flex items-center gap-2 hover:text-violet-600 transition-colors">
                          <Users className="w-5 h-5" /> Vote
                        </button>
                      </div>
                      <span className="text-xs text-gray-400">0 interactions</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-8 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !title || !description || !selectedOption || options.filter(o => o.url).length < 2}
                  className="w-full group relative overflow-hidden rounded-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600"></div>
                  <div className="relative px-8 py-5 flex items-center justify-center gap-3">
                    <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin relative z-10 text-white" />
                        <span className="relative z-10 text-lg font-bold text-white">Publishing your post...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6 relative z-10 text-white group-hover:rotate-12 transition-transform" />
                        <span className="relative z-10 text-lg font-bold text-white">Publish to Community</span>
                        <ArrowRight className="w-5 h-5 relative z-10 text-white group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
                <p className="text-center text-gray-500 text-sm mt-4">
                  By publishing, you agree to our community guidelines
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Add product URLs and we'll automatically fetch preview images</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>You can add up to 5 options for your community to vote on</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <span>Choose "Help me choose" for decision-making or "How do I look?" for style feedback</span>
            </li>
          </ul>
        </div>
      </div>

      <style >{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(30px, -50px) scale(1.1) rotate(120deg); }
          66% { transform: translate(-20px, 20px) scale(0.9) rotate(240deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(360deg); }
        }
        @keyframes float {
          0% { transform: translate(0, 0px); }
          50% { transform: translate(0, -20px); }
          100% { transform: translate(0, 0px); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes slideIn {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreatePost;  