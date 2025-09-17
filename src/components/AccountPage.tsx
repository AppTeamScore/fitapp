import { useState, useEffect } from 'react';
import { ArrowLeft, User, Settings, Shield, Trash2, Edit, Save, X, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface AccountPageProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
  user: any;
}

interface UserProfile {
  name: string;
  email: string;
  age: number;
  height: number;
  weight: number;
  primaryGoal: string;
  fitnessLevel: string;
  workoutFrequency: string;
  workoutDuration: string;
  injuries?: string;
  limitations?: string;
  preferredWorkoutTypes?: string[];
  availableDays?: string[];
}

export function AccountPage({ onNavigate, onLogout, user }: AccountPageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error('Необходима авторизация');
        onNavigate('auth');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/profile`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setProfile(result.profile);
        setEditedProfile(result.profile);
      } else {
        toast.error('Ошибка загрузки профиля');
      }
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      toast.error('Ошибка загрузки профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!editedProfile) return;

    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error('Необходима авторизация');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(editedProfile)
      });

      if (response.ok) {
        const result = await response.json();
        setProfile(result.profile);
        setEditedProfile(result.profile);
        setIsEditing(false);
        toast.success('Профиль обновлен!');
      } else {
        toast.error('Ошибка сохранения профиля');
      }
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
      toast.error('Ошибка сохранения профиля');
    } finally {
      setIsSaving(false);
    }
  };

  const changePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Заполните все поля');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Новые пароли не совпадают');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Новый пароль должен содержать минимум 8 символов');
      return;
    }

    setIsChangingPassword(true);
    try {
      // Сначала проверяем текущий пароль, войдя с ним
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordData.currentPassword
      });

      if (loginError) {
        toast.error('Неверный текущий пароль');
        return;
      }

      // Теперь меняем пароль
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (updateError) {
        toast.error('Ошибка смены пароля');
        return;
      }

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Пароль успешно изменен!');
    } catch (error) {
      console.error('Ошибка смены пароля:', error);
      toast.error('Ошибка смены пароля');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const deleteAccount = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error('Необходима авторизация');
        return;
      }

      // Удаляем данные пользователя из KV store
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        // Удаляем аккаунт из Supabase Auth
        await supabase.auth.admin.deleteUser(user.id);
        
        toast.success('Аккаунт удален');
        onLogout();
      } else {
        toast.error('Ошибка удаления аккаунта');
      }
    } catch (error) {
      console.error('Ошибка удаления аккаунта:', error);
      toast.error('Ошибка удаления аккаунта');
    }
  };

  const updateEditedProfile = (field: string, value: any) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  const cancelEditing = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">Аккаунт</h1>
        </div>
        <User className="w-6 h-6 text-primary" />
      </div>

      {/* Информация о профиле */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Личная информация
            </CardTitle>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Редактировать
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={saveProfile} disabled={isSaving}>
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={cancelEditing}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing && editedProfile ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Имя</Label>
                  <Input
                    value={editedProfile.name || ''}
                    onChange={(e) => updateEditedProfile('name', e.target.value)}
                    placeholder="Ваше имя"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={editedProfile.email || user.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Возраст</Label>
                  <Input
                    type="number"
                    value={editedProfile.age || ''}
                    onChange={(e) => updateEditedProfile('age', parseInt(e.target.value))}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Рост (см)</Label>
                  <Input
                    type="number"
                    value={editedProfile.height || ''}
                    onChange={(e) => updateEditedProfile('height', parseInt(e.target.value))}
                    placeholder="175"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Вес (кг)</Label>
                  <Input
                    type="number"
                    value={editedProfile.weight || ''}
                    onChange={(e) => updateEditedProfile('weight', parseInt(e.target.value))}
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Основная цель</Label>
                <Select
                  value={editedProfile.primaryGoal || ''}
                  onValueChange={(value) => updateEditedProfile('primaryGoal', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите цель" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="снижение-веса">Снижение веса</SelectItem>
                    <SelectItem value="набор-мышц">Набор мышечной массы</SelectItem>
                    <SelectItem value="увеличение-силы">Увеличение силы</SelectItem>
                    <SelectItem value="выносливость">Выносливость</SelectItem>
                    <SelectItem value="гибкость">Гибкость</SelectItem>
                    <SelectItem value="общая-форма">Общая физическая форма</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Уровень подготовки</Label>
                <Select
                  value={editedProfile.fitnessLevel || ''}
                  onValueChange={(value) => updateEditedProfile('fitnessLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="начинающий">Начинающий</SelectItem>
                    <SelectItem value="средний">Средний</SelectItem>
                    <SelectItem value="продвинутый">Продвинутый</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Частота тренировок</Label>
                  <Select
                    value={editedProfile.workoutFrequency || ''}
                    onValueChange={(value) => updateEditedProfile('workoutFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите частоту" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-3">2-3 раза в неделю</SelectItem>
                      <SelectItem value="3-4">3-4 раза в неделю</SelectItem>
                      <SelectItem value="4-5">4-5 раз в неделю</SelectItem>
                      <SelectItem value="6-7">6-7 раз в неделю</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Длительность тренировки</Label>
                  <Select
                    value={editedProfile.workoutDuration || ''}
                    onValueChange={(value) => updateEditedProfile('workoutDuration', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите длительность" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20-30">20-30 минут</SelectItem>
                      <SelectItem value="30-45">30-45 минут</SelectItem>
                      <SelectItem value="45-60">45-60 минут</SelectItem>
                      <SelectItem value="60+">60+ минут</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Имя:</span>
                <span>{profile?.name || 'Не указано'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span>{profile?.email || user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Возраст:</span>
                <span>{profile?.age || 'Не указано'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Рост:</span>
                <span>{profile?.height ? `${profile.height} см` : 'Не указано'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Вес:</span>
                <span>{profile?.weight ? `${profile.weight} кг` : 'Не указано'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Цель:</span>
                <span>{
                  profile?.primaryGoal === 'снижение-веса' ? 'Снижение веса' :
                  profile?.primaryGoal === 'набор-мышц' ? 'Набор мышечной массы' :
                  profile?.primaryGoal === 'увеличение-силы' ? 'Увеличение силы' :
                  profile?.primaryGoal === 'выносливость' ? 'Выносливость' :
                  profile?.primaryGoal === 'гибкость' ? 'Гибкость' :
                  profile?.primaryGoal === 'общая-форма' ? 'Общая физическая форма' :
                  profile?.primaryGoal || 'Не указано'
                }</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Уровень:</span>
                <span>{
                  profile?.fitnessLevel === 'начинающий' ? 'Начинающий' :
                  profile?.fitnessLevel === 'средний' ? 'Средний' :
                  profile?.fitnessLevel === 'продвинутый' ? 'Продвинутый' :
                  profile?.fitnessLevel || 'Не указано'
                }</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Смена пароля */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Безопасность
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Текущий пароль</Label>
            <div className="relative">
              <Input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Введите текущий пароль"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Новый пароль</Label>
            <div className="relative">
              <Input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Введите новый пароль"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Подтвердите новый пароль</Label>
            <div className="relative">
              <Input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Повторите новый пароль"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button onClick={changePassword} disabled={isChangingPassword} className="w-full">
            {isChangingPassword ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            Изменить пароль
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Управление аккаунтом */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Управление аккаунтом
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={onLogout} variant="outline" className="w-full">
            Выйти из аккаунта
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Удалить аккаунт
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить аккаунт?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие нельзя отменить. Все ваши данные, планы тренировок и прогресс будут удалены навсегда.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAccount} className="bg-destructive text-destructive-foreground">
                  Удалить аккаунт
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}