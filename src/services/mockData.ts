// src/services/mockData.ts
import { Post, FilterType } from '../types';

/**
 * Returns mock posts data filtered by the specified filter type
 */
export const getMockPosts = (filter: FilterType): Post[] => {
  // Base mock data - represents all posts
  const allPosts: Post[] = [
    {
      id: 1,
      title: "Which dress for a summer wedding?",
      user: {
        id: 101,
        username: "fashionlover",
        email: "fashion@example.com",
        picture:""
      },
      options: [
        { 
          id: 1001, 
          url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28219632/2024/3/12/9da6c838-2e37-451c-91ee-619d95be9a2b1710256687563CampusSutraMenClassicOpaqueCheckedCasualShirt4.jpg",  
          image: '', productName: '', siteName: ''
        },
        { 
          id: 1002, 
          url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28219632/2024/3/12/9da6c838-2e37-451c-91ee-619d95be9a2b1710256687563CampusSutraMenClassicOpaqueCheckedCasualShirt4.jpg",  
          image: '', productName: '', siteName: ''
        },
        { 
          id: 1003, 
          url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28219632/2024/3/12/9da6c838-2e37-451c-91ee-619d95be9a2b1710256687563CampusSutraMenClassicOpaqueCheckedCasualShirt4.jpg",  
          image: '', productName: '', siteName: ''
        }
      ],
      comments: [
        {
          id: 10001,
          text: "I love the first option!",
          userId: 102,
          username: "stylefan",
          createdAt: "2023-05-15T12:00:00Z"
        },
        {
          id: 10002,
          text: "The second one looks more versatile.",
          userId: 103,
          username: "fashionista",
          createdAt: "2023-05-15T13:30:00Z"
        }
      ]
    },
    {
      id: 2,
      title: "Help me pick shoes for my interview",
      user: {
        id: 104,
        username: "careergirl",
        email: "career@example.com",
        picture:""
      },
      options: [
        { 
          id: 2001, 
          url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28219632/2024/3/12/9da6c838-2e37-451c-91ee-619d95be9a2b1710256687563CampusSutraMenClassicOpaqueCheckedCasualShirt4.jpg",  
          image: '', productName: '', siteName: ''
        },
        { 
          id: 2002, 
          url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28219632/2024/3/12/9da6c838-2e37-451c-91ee-619d95be9a2b1710256687563CampusSutraMenClassicOpaqueCheckedCasualShirt4.jpg", 
          image: '', productName: '', siteName: ''
        }
      ],
      comments: [
        {
          id: 20001,
          text: "Navy loafers are more comfortable for all-day wear.",
          userId: 105,
          username: "officeexpert",
          createdAt: "2023-05-16T09:15:00Z"
        }
      ]
    },
    {
      id: 3,
      title: "Which jacket for fall?",
      user: {
        id: 101,
        username: "fashionlover",
        email: "fashion@example.com",
        picture:""
      },
      options: [
        { 
          id: 3001, 
          url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28219632/2024/3/12/9da6c838-2e37-451c-91ee-619d95be9a2b1710256687563CampusSutraMenClassicOpaqueCheckedCasualShirt4.jpg", 
          image: '', productName: '', siteName: ''
        },
        { 
          id: 3002, 
          url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28219632/2024/3/12/9da6c838-2e37-451c-91ee-619d95be9a2b1710256687563CampusSutraMenClassicOpaqueCheckedCasualShirt4.jpg",
          image: '', productName: '', siteName: ''
        }
      ],
      comments: [
        {
          id: 30001,
          text: "The trench coat is more versatile for different weather conditions.",
          userId: 106,
          username: "weatherwise",
          createdAt: "2023-09-10T14:20:00Z"
        },
        {
          id: 30002,
          text: "Leather jackets never go out of style!",
          userId: 107,
          username: "trendspotter",
          createdAt: "2023-09-11T08:45:00Z"
        }
      ]
    },
    {
      id: 4,
      title: "Which sunglasses for my beach vacation?",
      user: {
        id: 108,
        username: "travelbug",
        email: "travel@example.com",
        picture:""
      },
      options: [
        { 
          id: 4001, 
          url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28219632/2024/3/12/9da6c838-2e37-451c-91ee-619d95be9a2b1710256687563CampusSutraMenClassicOpaqueCheckedCasualShirt4.jpg", 
          image: '', productName: '', siteName: ''
        },
        { 
          id: 4002, 
          url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28219632/2024/3/12/9da6c838-2e37-451c-91ee-619d95be9a2b1710256687563CampusSutraMenClassicOpaqueCheckedCasualShirt4.jpg", 
          image: '', productName: '', siteName: ''
        },
        { 
          id: 4003, 
          url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28219632/2024/3/12/9da6c838-2e37-451c-91ee-619d95be9a2b1710256687563CampusSutraMenClassicOpaqueCheckedCasualShirt4.jpg", 
          image: '', productName: '', siteName: ''
        }
      ],
      comments: [
        {
          id: 40001,
          text: "Make sure to get polarized lenses for the beach!",
          userId: 109,
          username: "beachlover",
          createdAt: "2023-06-20T10:15:00Z"
        }
      ]
    },
    {
      id: 5,
      title: "Which backpack for college?",
      user: {
        id: 110,
        username: "gradstudent",
        email: "student@example.com",
        picture:""
      },
      options: [
        { 
          id: 5001, 
          url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28219632/2024/3/12/9da6c838-2e37-451c-91ee-619d95be9a2b1710256687563CampusSutraMenClassicOpaqueCheckedCasualShirt4.jpg", 
          image: '', productName: '', siteName: ''
        },
        { 
          id: 5002, 
          url: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28219632/2024/3/12/9da6c838-2e37-451c-91ee-619d95be9a2b1710256687563CampusSutraMenClassicOpaqueCheckedCasualShirt4.jpg", 
          image: '', productName: '', siteName: ''
        }
      ],
      comments: [
        {
          id: 50001,
          text: "The tech backpack has saved me so many times with the charging port!",
          userId: 111,
          username: "techie",
          createdAt: "2023-08-05T16:45:00Z"
        },
        {
          id: 50002,
          text: "Canvas backpacks are more durable in my experience.",
          userId: 112,
          username: "practical",
          createdAt: "2023-08-06T09:30:00Z"
        }
      ]
    }
  ];

  // Apply filtering based on the filter type
  switch (filter) {
    case 'recent':
      // Sort by most recent (using the ID as a proxy for creation time)
      return [...allPosts].sort((a, b) => b.id - a.id);
    
    case 'popular':
      // Sort by total votes
      return [...allPosts].sort((a, b) => {
        const totalVotesA = a.options.reduce((sum, option) => sum + 2, 0);
        const totalVotesB = b.options.reduce((sum, option) => sum + 2, 0);
        return totalVotesB - totalVotesA;
      });
    
    case 'trending':
      // Sort by a combination of recency and popularity (simplified for mock)
      return [...allPosts].sort((a, b) => {
        const totalVotesA = a.options.reduce((sum, option) => sum + 2, 0);
        const totalVotesB = b.options.reduce((sum, option) => sum + 2, 0);
        const trendScoreA = totalVotesA * (0.5 + (a.id / 10));
        const trendScoreB = totalVotesB * (0.5 + (b.id / 10));
        return trendScoreB - trendScoreA;
      });
    
    default:
      return allPosts;
  }
};

// Update the fetchPosts function to use this mock data
export const mockFetchPosts = async (filter: FilterType): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredPosts = getMockPosts(filter);
      resolve(filteredPosts);
    }, 500);
  });
};