import React from 'react';
import { CreateVoteDto, Option } from '../types';

interface OptionCardProps {
  option: Option;
  index: number;
  onVote: (optionId: CreateVoteDto) => Promise<void>;
  hasVoted: boolean;
  isAuthenticated: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({ 
  option, 
  index, 
  onVote, 
  hasVoted, 
  isAuthenticated 
}) => {
  /**
   * Handle the vote button click
   */
  
  return (
    <div className="option-card">
      <img src={option.url} alt={`Option ${index}`} />
      <div className="option-info">
        <h4>Option {index}</h4>
        <div className="option-meta">
          {option.url && (
            <a href={option.url} target="_blank" rel="noopener noreferrer">
              Visit Store
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionCard;