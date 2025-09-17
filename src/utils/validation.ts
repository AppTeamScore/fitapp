// Утилиты для валидации форм

export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6) {
      return { valid: false, message: 'Пароль должен содержать минимум 6 символов' };
    }
    return { valid: true };
  },

  required: (value: string | number): boolean => {
    return value !== '' && value !== null && value !== undefined;
  },

  age: (age: string | number): boolean => {
    const ageNum = typeof age === 'string' ? parseInt(age) : age;
    return !isNaN(ageNum) && ageNum >= 13 && ageNum <= 120;
  },

  weight: (weight: string | number): boolean => {
    const weightNum = typeof weight === 'string' ? parseFloat(weight) : weight;
    return !isNaN(weightNum) && weightNum >= 20 && weightNum <= 500;
  },

  height: (height: string | number): boolean => {
    const heightNum = typeof height === 'string' ? parseInt(height) : height;
    return !isNaN(heightNum) && heightNum >= 100 && heightNum <= 250;
  }
};

export const validateForm = (data: Record<string, any>, rules: Record<string, string[]>): { 
  valid: boolean; 
  errors: Record<string, string> 
} => {
  const errors: Record<string, string> = {};
  
  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = data[field];
    
    fieldRules.forEach(rule => {
      switch (rule) {
        case 'required':
          if (!validation.required(value)) {
            errors[field] = 'Это поле обязательно для заполнения';
          }
          break;
        case 'email':
          if (value && !validation.email(value)) {
            errors[field] = 'Введите корректный email';
          }
          break;
        case 'age':
          if (value && !validation.age(value)) {
            errors[field] = 'Возраст должен быть от 13 до 120 лет';
          }
          break;
        case 'weight':
          if (value && !validation.weight(value)) {
            errors[field] = 'Вес должен быть от 20 до 500 кг';
          }
          break;
        case 'height':
          if (value && !validation.height(value)) {
            errors[field] = 'Рост должен быть от 100 до 250 см';
          }
          break;
      }
    });
  });
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};