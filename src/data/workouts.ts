import { Exercise, exercisesByCategory, getRandomExercises } from './exercises';

export interface Workout {
  id: number;
  name: string;
  duration: number;
  difficulty: string;
  exercises: number;
  description: string;
  exercises_list: Exercise[];
  category: string;
}

export const workouts: Workout[] = [
  {
    id: 1,
    name: "Кардио для начинающих",
    duration: 20,
    difficulty: "Легко",
    exercises: 8,
    description: "Легкие кардио упражнения для разминки и улучшения выносливости",
    category: "Кардио",
    exercises_list: [
      {
        id: "video_230",
        name: "Марш на месте",
        video: "video_230.mp4",
        duration: 30,
        rest: 10,
        category: "Кардио",
        difficulty: "Легко",
        muscleGroups: ["Ноги", "Кардио"]
      },
      {
        id: "video_049",
        name: "Марш на месте с разведением плеч",
        video: "video_049.mp4",
        duration: 30,
        rest: 10,
        category: "Кардио",
        difficulty: "Легко",
        muscleGroups: ["Плечи", "Кардио"]
      },
      {
        id: "video_023",
        name: "Шаг 'Джек'",
        video: "video_023.mp4",
        duration: 30,
        rest: 10,
        category: "Кардио",
        difficulty: "Легко",
        muscleGroups: ["Ноги", "Кардио"]
      },
      {
        id: "video_116",
        name: "Круговые движения рук с шагом назад",
        video: "video_116.mp4",
        duration: 30,
        rest: 10,
        category: "Кардио",
        difficulty: "Легко",
        muscleGroups: ["Плечи", "Кардио"]
      },
      {
        id: "video_006",
        name: "Прыжки звездочка",
        video: "video_006.mp4",
        duration: 30,
        rest: 15,
        category: "Кардио",
        difficulty: "Легко",
        muscleGroups: ["Все тело"]
      },
      {
        id: "video_181",
        name: "Прыжки на месте с высоким поднятием коленей",
        video: "video_181.mp4",
        duration: 30,
        rest: 15,
        category: "Кардио",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Кардио"]
      },
      {
        id: "video_104",
        name: "Прыжки с приседом",
        video: "video_104.mp4",
        duration: 30,
        rest: 15,
        category: "Кардио",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Ягодицы"]
      },
      {
        id: "video_249",
        name: "Бег",
        video: "video_249.mp4",
        duration: 30,
        rest: 15,
        category: "Кардио",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Кардио"]
      }
    ]
  },
  {
    id: 2,
    name: "Силовая тренировка верха",
    duration: 35,
    difficulty: "Средне",
    exercises: 10,
    description: "Комплексная тренировка для укрепления мышц верхней части тела",
    category: "Сила",
    exercises_list: [
      {
        id: "video_160",
        name: "Отжимания от стены",
        video: "video_160.mp4",
        duration: 30,
        rest: 15,
        category: "Сила",
        difficulty: "Легко",
        muscleGroups: ["Грудь", "Трицепс"]
      },
      {
        id: "video_178",
        name: "Отжимания на коленях",
        video: "video_178.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Легко",
        muscleGroups: ["Грудь", "Трицепс"]
      },
      {
        id: "video_093",
        name: "Отжимания на наклонной поверхности",
        video: "video_093.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Легко",
        muscleGroups: ["Грудь", "Трицепс"]
      },
      {
        id: "video_207",
        name: "Отжимания",
        video: "video_207.mp4",
        duration: 30,
        rest: 25,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Грудь", "Трицепс"]
      },
      {
        id: "video_070",
        name: "Отжимания с широкой постановкой рук",
        video: "video_070.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Грудь", "Плечи"]
      },
      {
        id: "video_021",
        name: "Сгибание рук с гантелями",
        video: "video_021.mp4",
        duration: 40,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Бицепс"],
        hasWeight: true
      },
      {
        id: "video_024",
        name: "Обратные отжимания",
        video: "video_024.mp4",
        duration: 30,
        rest: 25,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Трицепс", "Плечи"]
      },
      {
        id: "video_118",
        name: "Боковой подъем гантелей стоя",
        video: "video_118.mp4",
        duration: 40,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Плечи"],
        hasWeight: true
      },
      {
        id: "video_027",
        name: "Французский жим",
        video: "video_027.mp4",
        duration: 45,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Трицепс"],
        hasWeight: true
      },
      {
        id: "video_136",
        name: "Планка",
        video: "video_136.mp4",
        duration: 45,
        rest: 30,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс", "Стабилизация"]
      }
    ]
  },
  {
    id: 3,
    name: "HIIT интенсив",
    duration: 25,
    difficulty: "Сложно",
    exercises: 8,
    description: "Высокоинтенсивная интервальная тренировка для сжигания калорий",
    category: "HIIT",
    exercises_list: [
      {
        id: "video_232_hiit",
        name: "Берпи",
        video: "video_232.mp4",
        duration: 45,
        rest: 15,
        category: "HIIT",
        difficulty: "Сложно",
        muscleGroups: ["Все тело"]
      },
      {
        id: "video_120_hiit",
        name: "Дровосек с собственным весом",
        video: "video_120.mp4",
        duration: 45,
        rest: 15,
        category: "HIIT",
        difficulty: "Сложно",
        muscleGroups: ["Все тело", "Пресс"]
      },
      {
        id: "video_006_hiit",
        name: "Прыжки звездочка",
        video: "video_006.mp4",
        duration: 30,
        rest: 10,
        category: "HIIT",
        difficulty: "Средне",
        muscleGroups: ["Все тело"]
      },
      {
        id: "video_181_hiit",
        name: "Прыжки на месте с высоким поднятием коленей",
        video: "video_181.mp4",
        duration: 30,
        rest: 15,
        category: "HIIT",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Кардио"]
      },
      {
        id: "video_104_hiit",
        name: "Прыжки с приседом",
        video: "video_104.mp4",
        duration: 30,
        rest: 15,
        category: "HIIT",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Ягодицы"]
      },
      {
        id: "video_141",
        name: "Хлопки пальцами",
        video: "video_141.mp4",
        duration: 30,
        rest: 10,
        category: "HIIT",
        difficulty: "Легко",
        muscleGroups: ["Кардио"]
      },
      {
        id: "video_147",
        name: "Обратные выпады с движением рук вперед",
        video: "video_147.mp4",
        duration: 45,
        rest: 15,
        category: "HIIT",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Плечи"]
      },
      {
        id: "video_232_hiit",
        name: "Берпи",
        video: "video_232.mp4",
        duration: 30,
        rest: 15,
        category: "HIIT",
        difficulty: "Сложно",
        muscleGroups: ["Все тело"]
      }
    ]
  },
  {
    id: 4,
    name: "Тренировка пресса",
    duration: 20,
    difficulty: "Средне",
    exercises: 10,
    description: "Целенаправленная работа над мышцами пресса и стабилизацией",
    category: "Пресс",
    exercises_list: [
      {
        id: "video_001",
        name: "Скручивания на полу",
        video: "video_001.mp4",
        duration: 30,
        rest: 15,
        category: "Пресс",
        difficulty: "Легко",
        muscleGroups: ["Пресс"]
      },
      {
        id: "video_014",
        name: "Подъем прямых ног лежа",
        video: "video_014.mp4",
        duration: 30,
        rest: 15,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс"]
      },
      {
        id: "video_092",
        name: "Обратные скручивания",
        video: "video_092.mp4",
        duration: 30,
        rest: 15,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс"]
      },
      {
        id: "video_073",
        name: "Русский твист",
        video: "video_073.mp4",
        duration: 30,
        rest: 15,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс", "Косые"]
      },
      {
        id: "video_089",
        name: "Чередующие касания пяток",
        video: "video_089.mp4",
        duration: 30,
        rest: 15,
        category: "Пресс",
        difficulty: "Легко",
        muscleGroups: ["Косые мышцы"]
      },
      {
        id: "video_107",
        name: "Велосипед",
        video: "video_107.mp4",
        duration: 30,
        rest: 15,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс", "Косые"]
      },
      {
        id: "video_150",
        name: "Велосипед в воздухе",
        video: "video_150.mp4",
        duration: 30,
        rest: 15,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс", "Косые"]
      },
      {
        id: "video_136",
        name: "Планка",
        video: "video_136.mp4",
        duration: 45,
        rest: 20,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс", "Стабилизация"]
      },
      {
        id: "video_182",
        name: "Боковая планка",
        video: "video_182.mp4",
        duration: 30,
        rest: 20,
        category: "Пресс",
        difficulty: "Сложно",
        muscleGroups: ["Косые", "Стабилизация"]
      },
      {
        id: "video_115",
        name: "Кошачьи потягивания",
        video: "video_115.mp4",
        duration: 45,
        rest: 10,
        category: "Пресс",
        difficulty: "Легко",
        muscleGroups: ["Спина", "Мобильность"]
      }
    ]
  },
  {
    id: 5,
    name: "Тренировка ног",
    duration: 30,
    difficulty: "Средне",
    exercises: 10,
    description: "Комплексная тренировка для укрепления мышц ног и ягодиц",
    category: "Сила",
    exercises_list: [
      {
        id: "video_076",
        name: "Приседания",
        video: "video_076.mp4",
        duration: 45,
        rest: 20,
        category: "Сила",
        difficulty: "Легко",
        muscleGroups: ["Ноги", "Ягодицы"]
      },
      {
        id: "video_084",
        name: "Ягодичный мостик",
        video: "video_084.mp4",
        duration: 40,
        rest: 15,
        category: "Сила",
        difficulty: "Легко",
        muscleGroups: ["Ягодицы", "Бицепс бедра"]
      },
      {
        id: "video_085",
        name: "Ягодичный мостик на одной ноге",
        video: "video_085.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ягодицы", "Стабилизация"]
      },
      {
        id: "video_077",
        name: "Приседания с гантелями",
        video: "video_077.mp4",
        duration: 45,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Ягодицы"],
        hasWeight: true
      },
      {
        id: "video_140",
        name: "Выпады с гантелями",
        video: "video_140.mp4",
        duration: 40,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Ягодицы"],
        hasWeight: true
      },
      {
        id: "video_074",
        name: "Подъемы на носки",
        video: "video_074.mp4",
        duration: 40,
        rest: 15,
        category: "Сила",
        difficulty: "Легко",
        muscleGroups: ["Икры"]
      },
      {
        id: "video_075",
        name: "Подъемы на носки с гантелями",
        video: "video_075.mp4",
        duration: 40,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Икры"],
        hasWeight: true
      },
      {
        id: "video_104",
        name: "Прыжки с приседом",
        video: "video_104.mp4",
        duration: 30,
        rest: 15,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Ягодицы"]
      },
      {
        id: "video_136",
        name: "Планка",
        video: "video_136.mp4",
        duration: 45,
        rest: 25,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс", "Стабилизация"]
      },
      {
        id: "video_115",
        name: "Кошачьи потягивания",
        video: "video_115.mp4",
        duration: 45,
        rest: 10,
        category: "Сила",
        difficulty: "Легко",
        muscleGroups: ["Спина", "Мобильность"]
      }
    ]
  },
  {
    id: 6,
    name: "Растяжка и восстановление",
    duration: 25,
    difficulty: "Легко",
    exercises: 10,
    description: "Мягкие упражнения для растяжки и восстановления после тренировок",
    category: "Растяжка",
    exercises_list: [
      {
        id: "video_230",
        name: "Марш на месте",
        video: "video_230.mp4",
        duration: 60,
        rest: 10,
        category: "Растяжка",
        difficulty: "Легко",
        muscleGroups: ["Ноги", "Разминка"]
      },
      {
        id: "video_049",
        name: "Марш на месте с разведением плеч",
        video: "video_049.mp4",
        duration: 60,
        rest: 15,
        category: "Растяжка",
        difficulty: "Легко",
        muscleGroups: ["Плечи", "Мобильность"]
      },
      {
        id: "video_108",
        name: "Растяжка квадрицепса",
        video: "video_108.mp4",
        duration: 60,
        rest: 10,
        category: "Растяжка",
        difficulty: "Легко",
        muscleGroups: ["Квадрицепс"]
      },
      {
        id: "video_109",
        name: "Растяжка икроножных мышц",
        video: "video_109.mp4",
        duration: 60,
        rest: 10,
        category: "Растяжка",
        difficulty: "Легко",
        muscleGroups: ["Икры"]
      },
      {
        id: "video_110",
        name: "Растяжка подколенных сухожилий",
        video: "video_110.mp4",
        duration: 60,
        rest: 10,
        category: "Растяжка",
        difficulty: "Легко",
        muscleGroups: ["Бицепс бедра"]
      },
      {
        id: "video_111",
        name: "Растяжка ягодичных мышц",
        video: "video_111.mp4",
        duration: 60,
        rest: 10,
        category: "Растяжка",
        difficulty: "Легко",
        muscleGroups: ["Ягодицы"]
      },
      {
        id: "video_112",
        name: "Растяжка спины",
        video: "video_112.mp4",
        duration: 60,
        rest: 10,
        category: "Растяжка",
        difficulty: "Легко",
        muscleGroups: ["Спина"]
      },
      {
        id: "video_113",
        name: "Растяжка плеч",
        video: "video_113.mp4",
        duration: 45,
        rest: 10,
        category: "Растяжка",
        difficulty: "Легко",
        muscleGroups: ["Плечи"]
      },
      {
        id: "video_114",
        name: "Растяжка шеи",
        video: "video_114.mp4",
        duration: 45,
        rest: 10,
        category: "Растяжка",
        difficulty: "Легко",
        muscleGroups: ["Шея"]
      },
      {
        id: "video_115",
        name: "Кошачьи потягивания",
        video: "video_115.mp4",
        duration: 45,
        rest: 10,
        category: "Растяжка",
        difficulty: "Легко",
        muscleGroups: ["Спина", "Мобильность"]
      }
    ]
  },
  {
    id: 7,
    name: "Силовая тренировка с гантелями",
    duration: 40,
    difficulty: "Средне",
    exercises: 10,
    description: "Комплексная тренировка всего тела с использованием гантелей",
    category: "Сила",
    exercises_list: [
      {
        id: "video_025",
        name: "Жим гантелей лежа",
        video: "video_025.mp4",
        duration: 45,
        rest: 25,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Грудь", "Трицепс"],
        hasWeight: true
      },
      {
        id: "video_028",
        name: "Разведение гантелей лежа",
        video: "video_028.mp4",
        duration: 40,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Грудь"],
        hasWeight: true
      },
      {
        id: "video_031",
        name: "Разведение гантелей стоя",
        video: "video_031.mp4",
        duration: 35,
        rest: 20,
        category: "Сила",
        difficulty: "Легко",
        muscleGroups: ["Плечи"],
        hasWeight: true
      },
      {
        id: "video_034",
        name: "Сгибание рук с гантелями",
        video: "video_034.mp4",
        duration: 35,
        rest: 20,
        category: "Сила",
        difficulty: "Легко",
        muscleGroups: ["Бицепс"],
        hasWeight: true
      },
      {
        id: "video_035",
        name: "Молотковые сгибания",
        video: "video_035.mp4",
        duration: 35,
        rest: 20,
        category: "Сила",
        difficulty: "Легко",
        muscleGroups: ["Бицепс", "Предплечья"],
        hasWeight: true
      },
      {
        id: "video_037",
        name: "Тяга гантели в наклоне",
        video: "video_037.mp4",
        duration: 40,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Спина", "Бицепс"],
        hasWeight: true
      },
      {
        id: "video_077",
        name: "Приседания с гантелями",
        video: "video_077.mp4",
        duration: 45,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Ягодицы"],
        hasWeight: true
      },
      {
        id: "video_079",
        name: "Становая тяга с гантелями",
        video: "video_079.mp4",
        duration: 45,
        rest: 25,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Ягодицы", "Спина"],
        hasWeight: true
      },
      {
        id: "video_080",
        name: "Румынская тяга",
        video: "video_080.mp4",
        duration: 40,
        rest: 25,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ягодицы", "Бицепс бедра"],
        hasWeight: true
      },
      {
        id: "video_075",
        name: "Подъемы на носки с гантелями",
        video: "video_075.mp4",
        duration: 40,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Икры"],
        hasWeight: true
      }
    ]
  }
];