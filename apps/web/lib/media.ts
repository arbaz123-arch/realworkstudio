// Media optimization utilities for Cloudinary URLs

/**
 * Optimize a Cloudinary image URL with automatic quality and format
 * Adds q_auto (automatic quality) and f_auto (automatic format) parameters
 */
export function optimizeCloudinaryUrl(url: string | null | undefined): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url || '';
  }

  // Split URL to insert transformations before the version segment
  // Cloudinary URL format: https://res.cloudinary.com/{cloud}/image/upload/{version}/{public_id}
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url;
  }

  const prefix = url.slice(0, uploadIndex + 7); // includes '/upload/'
  const suffix = url.slice(uploadIndex + 7);

  // Check if transformations already exist
  if (suffix.startsWith('q_auto') || suffix.startsWith('f_auto')) {
    return url;
  }

  return `${prefix}q_auto,f_auto/${suffix}`;
}

/**
 * Create a responsive image URL with specified width
 */
export function getResponsiveImageUrl(url: string, width: number): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url;
  }

  const prefix = url.slice(0, uploadIndex + 7);
  const suffix = url.slice(uploadIndex + 7);

  // Check if transformations already exist
  if (suffix.startsWith('w_') || suffix.startsWith('q_auto')) {
    return url;
  }

  return `${prefix}w_${width},q_auto,f_auto/${suffix}`;
}

/**
 * Get initials from a name for avatar fallback
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a consistent avatar color based on name
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
