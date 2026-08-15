import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

export default function StarRating({ rating, count, interactive = false, onRatingChange }) {
  const [hoverRating, setHoverRating] = useState(0);
  const currentRating = interactive ? (hoverRating || rating) : rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex ${interactive ? 'cursor-pointer' : ''}`} onMouseLeave={() => interactive && setHoverRating(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className="relative"
            onMouseEnter={() => interactive && setHoverRating(star)}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          >
            <FiStar size={14} className="text-gray-600" />
            {currentRating >= star ? (
              <span className="absolute inset-0 overflow-hidden">
                <FiStar size={14} className="text-yellow-400 fill-yellow-400 transition-all" />
              </span>
            ) : currentRating >= star - 0.5 ? (
              <span className="absolute inset-0 overflow-hidden w-1/2">
                <FiStar size={14} className="text-yellow-400 fill-yellow-400 transition-all" />
              </span>
            ) : null}
          </span>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-gray-400 text-xs">({count})</span>
      )}
    </div>
  );
}
