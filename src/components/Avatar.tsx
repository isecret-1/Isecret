import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  color: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  handle?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ color, size = 'md', handle }) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 18,
    lg: 28,
    xl: 40,
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center shadow-sm border border-white/10`}
      style={{ backgroundColor: color }}
    >
      {/* Simplified Identicon logic: just the user icon or initials if we wanted */}
      <User color="white" size={iconSizes[size]} strokeWidth={2.5} />
    </div>
  );
};