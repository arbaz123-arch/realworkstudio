import { getInitials, getAvatarColor, optimizeCloudinaryUrl } from '@/lib/media';

export type AvatarProps = {
  name: string;
  photoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function Avatar({ name, photoUrl, size = 'md', className = '' }: AvatarProps) {
  const hasPhoto = photoUrl && photoUrl.trim() !== '';
  const optimizedUrl = hasPhoto ? optimizeCloudinaryUrl(photoUrl) : null;

  if (optimizedUrl) {
    return (
      <img
        src={optimizedUrl}
        alt={name}
        loading="lazy"
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
        onError={(e) => {
          // Fallback to initials on image error
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const fallback = document.createElement('div');
            fallback.className = `${getAvatarColor(name)} ${sizeClasses[size]} ${className} rounded-full flex items-center justify-center text-white font-medium`;
            fallback.textContent = getInitials(name);
            parent.appendChild(fallback);
          }
        }}
      />
    );
  }

  return (
    <div
      className={`${getAvatarColor(name)} ${sizeClasses[size]} ${className} rounded-full flex items-center justify-center text-white font-medium`}
    >
      {getInitials(name)}
    </div>
  );
}
