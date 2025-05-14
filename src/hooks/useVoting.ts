// src/hooks/useVoting.ts
import { useState, useEffect } from 'react';
import { voteService } from '../services/api';
import { Post, Option, CreateVoteDto } from '../types';

interface UseVotingResult {
  hasVoted: boolean;
  selectedOption: number | null;
  totalVotes: number;
  handleVote: (optionId: CreateVoteDto) => Promise<void>;
  getPercentage: (optionId: number) => number;
}

interface UserVotes {
  [postId: number]: number; // Maps postId to optionId
}

/**
 * Custom hook to handle voting functionality
 * @param post - The post to vote on
 * @param userId - The current user's ID
 * @param isAuthenticated - Whether the user is authenticated
 * @returns Voting state and functions
 */
export const useVoting = (
  post: Post | null,
  userId: number | null,
  isAuthenticated: boolean
): UseVotingResult => {
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  
  // Calculate total votes across all options
  const totalVotes = options.reduce((sum, option) => sum + 1, 0);
  
  // Load initial voting state
  useEffect(() => {
    if (!post || !userId || !isAuthenticated) return;
    
    // Set options from post
    setOptions(post.options);
    
    // Check if user has already voted on this post
    const userVotesStr = localStorage.getItem(`votes-${userId}`);
    if (userVotesStr) {
      try {
        const userVotes: UserVotes = JSON.parse(userVotesStr);
        
        if (userVotes[post.id]) {
          setHasVoted(true);
          setSelectedOption(userVotes[post.id]);
          
          // Mark which option the user voted for
          const votedOptionId = userVotes[post.id];
          setOptions(post.options.map(option => ({
            ...option,
            hasUserVoted: option.id === votedOptionId
          })));
        }
      } catch (error) {
        console.error('Error parsing user votes:', error);
      }
    }
  }, [post, userId, isAuthenticated]);
  
  /**
   * Handle voting for an option
   * @param optionId - The ID of the option to vote for
   */
  const handleVote = async (optionId: CreateVoteDto): Promise<void> => {
    if (!post || !isAuthenticated || hasVoted || !userId) {
      return;
    }
    
    try {
      // Call the API to register the vote
      await voteService.vote(post.id, optionId);
      
      
    } catch (error) {
      console.error('Error voting:', error);
    }
  };
  
  /**
   * Calculate the percentage of votes for an option
   * @param optionId - The ID of the option
   * @returns The percentage of votes for the option
   */
  const getPercentage = (optionId: number): number => {
    if (totalVotes === 0) return 0;
    
    const option = options.find(opt => opt.id === optionId);
    if (!option) return 0;
    
    return Math.round((1 / totalVotes) * 100);
  };
  
  return {
    hasVoted,
    selectedOption,
    totalVotes,
    handleVote,
    getPercentage
  };
};