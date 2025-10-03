import { Home, Dumbbell, Calendar, BookOpen, User, BicepsFlexed } from "lucide-react";
import { Button } from "./ui/button";

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'home', label: 'Главная', icon: Home },
    { id: 'exercises', label: 'Упражнения', icon: BicepsFlexed },
    { id: 'workouts', label: 'Тренировка', icon: Dumbbell },
    { id: 'calendar', label: 'Календарь', icon: Calendar },
    { id: 'account', label: 'Профиль', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border max-w-lg mx-auto">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(item.id)}
              className={`flex-col h-16 w-18 p-1 transition-colors ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <item.icon className={`h-5 w-5 mb-1 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-xs ${isActive ? 'text-primary font-medium' : ''}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
      {/* Безопасная зона для iPhone */}
      <div className="h-safe-area-inset-bottom"></div>
    </div>
  );
}