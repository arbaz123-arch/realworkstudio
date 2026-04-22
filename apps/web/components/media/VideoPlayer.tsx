'use client';

import { useState } from 'react';

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export type VideoPlayerProps = {
  videoUrl: string;
  thumbnailUrl?: string | null;
  className?: string;
};

export function VideoPlayer({ videoUrl, thumbnailUrl, className = '' }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsPlaying(false);
  };

  // YouTube URL detection
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const youtubeId = isYouTube ? extractYouTubeId(videoUrl) : null;

  if (hasError) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-gray-100 ${className}`}>
        <p className="text-sm text-gray-500">Video unavailable</p>
      </div>
    );
  }

  // YouTube embed
  if (isYouTube && youtubeId) {
    return (
      <div className={`relative aspect-video ${className}`}>
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="group relative h-full w-full overflow-hidden rounded-lg"
            aria-label="Play video"
          >
            {/* Thumbnail or placeholder */}
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt="Video thumbnail"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-900">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <PlayIcon className="ml-1 h-8 w-8 text-white" />
                </div>
              </div>
            )}
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
              <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                <PlayIcon className="ml-1 h-8 w-8 text-gray-900" />
              </div>
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full rounded-lg"
            onError={handleError}
          />
        )}
      </div>
    );
  }

  // Direct video URL
  return (
    <div className={`relative aspect-video ${className}`}>
      {!isPlaying ? (
        <button
          onClick={handlePlay}
          className="group relative h-full w-full overflow-hidden rounded-lg"
          aria-label="Play video"
        >
          {/* Thumbnail or placeholder */}
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
                <PlayIcon className="ml-1 h-8 w-8 text-white" />
              </div>
            </div>
          )}
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
            <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
              <PlayIcon className="ml-1 h-8 w-8 text-gray-900" />
            </div>
          </div>
        </button>
      ) : (
        <video
          src={videoUrl}
          controls
          autoPlay
          className="h-full w-full rounded-lg"
          onError={handleError}
        />
      )}
    </div>
  );
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/watch\?.*v=([^&\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}
