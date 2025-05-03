export const fetchPosts = async (filter) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would normally fetch from a backend
        resolve([]);
      }, 500);
    });
  };
  
  export const fetchPostById = async (id) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would normally fetch from a backend
        resolve(null);
      }, 500);
    });
  };
  
  export const createPost = async (postData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would normally send to a backend
        resolve({ id: 'new-post-id', ...postData });
      }, 500);
    });
  };
  
  export const voteOnOption = async (postId, optionId) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would normally send to a backend
        resolve({ success: true });
      }, 300);
    });
  };
  
  export const addComment = async (postId, comment) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // This would normally send to a backend
        resolve({ id: 'new-comment-id', ...comment });
      }, 300);
    });
  };
  
  export const loginUser = async (credentials) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // This would normally authenticate with a backend
        if (credentials.email && credentials.password) {
          resolve({
            token: 'mock-token',
            user: {
              id: 'user1',
              username: 'fashionlover',
              email: credentials.email
            }
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };
  
  export const registerUser = async (userData) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // This would normally register with a backend
        if (userData.username && userData.email && userData.password) {
          resolve({
            token: 'mock-token',
            user: {
              id: 'user' + Date.now(),
              username: userData.username,
              email: userData.email
            }
          });
        } else {
          reject(new Error('Invalid user data'));
        }
      }, 500);
    });
  };
  
  