import { Dumbbell } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ message = 'Загрузка...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}></div>
        <Dumbbell className="absolute inset-0 m-auto w-4 h-4 text-primary animate-pulse" />
      </div>
      <p className="text-muted-foreground text-sm animate-pulse">{message}</p>
    </div>
  );
}