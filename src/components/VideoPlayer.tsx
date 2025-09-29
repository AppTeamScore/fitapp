import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface VideoPlayerProps {
  videoSrc: string;
  exerciseName: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  onVideoEnd?: () => void;
}

export function VideoPlayer({ 
  videoSrc, 
  exerciseName, 
  autoPlay = false, 
  loop = true, 
  muted = true,
  onVideoEnd 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoPath = `/videos/${videoSrc}`;

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setVideoError(true));
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setVideoError(true));
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setVideoError(true));
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIsLoading(false);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setVideoError(false);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (onVideoEnd) {
      onVideoEnd();
    }
  };

  if (videoError) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Play className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{exerciseName}</p>
              <p className="text-sm text-muted-foreground">Видео: {videoSrc}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Видео не найдено. Поместите файл в папку /public/videos/
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-white">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          
          <video
            ref={videoRef}
            className="w-full aspect-video object-contain"
            loop={loop}
            muted={isMuted}
            playsInline
            onError={handleVideoError}
            onLoadedData={handleVideoLoad}
            onEnded={handleVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={videoPath} type="video/mp4" />
            Ваш браузер не поддерживает воспроизведение видео.
          </video>

          {/* Контролы */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-800/60 to-transparent p-4">
            <div className="flex items-center justify-between text-gray-900">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-gray-900 hover:text-gray-900 hover:bg-gray-200/50 h-8 w-8 p-0"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={restartVideo}
                  className="text-gray-900 hover:text-gray-900 hover:bg-gray-200/50 h-8 w-8 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-gray-900 hover:text-gray-900 hover:bg-gray-200/50 h-8 w-8 p-0"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-3">
          <p className="font-medium text-sm">{exerciseName}</p>
          <p className="text-xs text-muted-foreground">{videoSrc}</p>
        </div>
      </CardContent>
    </Card>
  );
}