import React from 'react';
import {Option} from '../types';

// Define props interface for OptionCard component
interface OptionCardProps {
  option: Option;
  index: number;
  onVote: (optionId: number) => void;
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
  return (
    <div className="option-card">
      <img src={option.imageUrl} alt={`Option ${index + 1}`} />
      <div className="option-info">
        <h4>Option {index + 1}</h4>
        <p>{option.description}</p>
        <div className="option-meta">
          <span>{option.price && `$${option.price}`}</span>
          <span>{option.store}</span>
          {option.url && (
            <a href={option.url} target="_blank" rel="noopener noreferrer">
              Visit Store
            </a>
          )}
        </div>
        <button 
          onClick={() => onVote(option.id)} 
          disabled={hasVoted || !isAuthenticated}
          className={`vote-btn ${hasVoted && option.hasUserVoted ? 'voted' : ''}`}
        >
          {hasVoted && option.hasUserVoted ? 'Voted' : 'Vote'} ({option.votes})
        </button>
      </div>
    </div>
  );
};

export default OptionCard;