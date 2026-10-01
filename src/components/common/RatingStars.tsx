import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number; // 0 - 5
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showValue = false,
}) => {
  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const starIconSize = sizeMap[size];

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, i) => {
          const starNumber = i + 1;
          const isFilled = starNumber <= Math.round(rating);

          return (
            <button
              type="button"
              key={i}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starNumber)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform p-0.5' : 'cursor-default'}`}
              aria-label={interactive ? `Rate ${starNumber} stars` : undefined}
            >
              <Star
                className={`${starIconSize} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 fill-slate-100'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-slate-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

