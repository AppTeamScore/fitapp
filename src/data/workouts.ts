import { Exercise, exercisesByCategory, getRandomExercises } from './exercises';

export interface WorkoutExercise extends Exercise {
  sets: number;
}

export interface Workout {
  id: number;
  name: string;
  duration: number;
  difficulty: string;
  exercises: number;
  description: string;
  exercises_list: WorkoutExercise[];
  category: string;
}

export const workouts: Workout[] = [
  {
    id: 1,
    name: "Кардио для начинающих",
    duration: 25,
    difficulty: "Легко",
    exercises: 6,
    description: "Легкие кардио упражнения для разминки и улучшения выносливости. Идеально для новичков, чтобы разогреть тело без перегрузки.",
    category: "Кардио",
    exercises_list: [
      {
        id: "video_230",
        name: "Марш на месте",
        video: "video_230.mp4",
        duration: 60,
        rest: 10,
        category: "Кардио",
        difficulty: "Легко",
        muscleGroups: ["Ноги", "Кардио"],
        sets: 3
      },
      {
        id: "video_049",
        name: "Марш на месте с разведением плеч",
        video: "video_049.mp4",
        duration: 60,
        rest: 15,
        category: "Кардио",
        difficulty: "Легко",
        muscleGroups: ["Плечи", "Грудь", "Ноги", "Кардио"],
        sets: 3
      },
      {
        id: "video_023",
        name: "Шаг 'Джек'",
        video: "video_023.mp4",
        duration: 60,
        rest: 15,
        category: "Кардио",
        difficulty: "Легко",
        muscleGroups: ["Ноги", "Кардио"],
        sets: 3
      },
      {
        id: "video_116",
        name: "Круговые движения рук с шагом назад",
        video: "video_116.mp4",
        duration: 60,
        rest: 15,
        category: "Кардио",
        difficulty: "Легко",
        muscleGroups: ["Плечи", "Кардио"],
        sets: 3
      },
      {
        id: "video_006",
        name: "Прыжки звездочка",
        video: "video_006.mp4",
        duration: 30,
        rest: 15,
        category: "Кардио",
        difficulty: "Легко",
        muscleGroups: ["Все тело", "Кардио"],
        sets: 3
      },
      {
        id: "video_101",
        name: "Подъем рук с шагом на месте",
        video: "video_101.mp4",
        duration: 60,
        rest: 15,
        category: "Кардио",
        difficulty: "Легко",
        muscleGroups: ["Плечи", "Кардио"],
        sets: 3
      }
    ]
  },
  {
    id: 2,
    name: "Силовая тренировка верха",
    duration: 40,
    difficulty: "Средне",
    exercises: 8,
    description: "Комплексная тренировка для укрепления мышц верхней части тела: грудь, спина, плечи и руки. Подходит для среднего уровня.",
    category: "Сила",
    exercises_list: [
      {
        id: "video_160",
        name: "Отжимания от стены",
        video: "video_160.mp4",
        duration: 60,
        rest: 15,
        category: "Сила",
        difficulty: "Легко",
        muscleGroups: ["Грудь", "Трицепс"],
        sets: 3
      },
      {
        id: "video_178",
        name: "Отжимания на коленях",
        video: "video_178.mp4",
        duration: 60,
        rest: 20,
        category: "Сила",
        difficulty: "Легко",
        muscleGroups: ["Грудь", "Трицепс"],
        sets: 3
      },
      {
        id: "video_207",
        name: "Отжимания",
        video: "video_207.mp4",
        duration: 30,
        rest: 25,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Грудь", "Трицепс"],
        sets: 3
      },
      {
        id: "video_021",
        name: "Сгибание рук с гантелями",
        video: "video_021.mp4",
        duration: 120,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Бицепс"],
        hasWeight: true,
        sets: 3
      },
      {
        id: "video_024",
        name: "Обратные отжимания",
        video: "video_024.mp4",
        duration: 60,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Трицепс", "Плечи"],
        sets: 3
      },
      {
        id: "video_118",
        name: "Боковой подъем гантелей стоя",
        video: "video_118.mp4",
        duration: 60,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Плечи"],
        hasWeight: true,
        sets: 3
      },
      {
        id: "video_075",
        name: "Тяга верхнего блока к груди",
        video: "video_075.mp4",
        duration: 120,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Спина"],
        sets: 4
      },
      {
        id: "video_128",
        name: "Тяга гантелей в наклоне",
        video: "video_128.mp4",
        duration: 60,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Спина"],
        hasWeight: true,
        sets: 4
      }
    ]
  },
  {
    id: 3,
    name: "HIIT интенсив",
    duration: 30,
    difficulty: "Сложно",
    exercises: 7,
    description: "Высокоинтенсивная интервальная тренировка для сжигания калорий и повышения выносливости. Короткие перерывы для максимального эффекта.",
    category: "HIIT",
    exercises_list: [
      {
        id: "video_232_hiit",
        name: "Берпи",
        video: "video_232.mp4",
        duration: 60,
        rest: 15,
        category: "HIIT",
        difficulty: "Сложно",
        muscleGroups: ["Все тело"],
        sets: 3
      },
      {
        id: "video_120_hiit",
        name: "Дровосек с собственным весом",
        video: "video_120.mp4",
        duration: 60,
        rest: 15,
        category: "HIIT",
        difficulty: "Сложно",
        muscleGroups: ["Все тело", "Пресс"],
        sets: 4
      },
      {
        id: "video_006_hiit",
        name: "Прыжки звездочка",
        video: "video_006.mp4",
        duration: 60,
        rest: 10,
        category: "HIIT",
        difficulty: "Средне",
        muscleGroups: ["Все тело"],
        sets: 3
      },
      {
        id: "video_181_hiit",
        name: "Прыжки на месте с высоким поднятием коленей",
        video: "video_181.mp4",
        duration: 60,
        rest: 15,
        category: "HIIT",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Кардио"],
        sets: 3
      },
      {
        id: "video_104_hiit",
        name: "Прыжки с приседом",
        video: "video_104.mp4",
        duration: 45,
        rest: 15,
        category: "HIIT",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Ягодицы"],
        sets: 3
      },
      {
        id: "video_141",
        name: "Хлопки пальцами",
        video: "video_141.mp4",
        duration: 60,
        rest: 10,
        category: "HIIT",
        difficulty: "Легко",
        muscleGroups: ["Кардио"],
        sets: 3
      },
      {
        id: "video_147",
        name: "Обратные выпады с движением рук вперед",
        video: "video_147.mp4",
        duration: 60,
        rest: 15,
        category: "HIIT",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Плечи"],
        sets: 4
      }
    ]
  },
  {
    id: 4,
    name: "Тренировка пресса",
    duration: 25,
    difficulty: "Средне",
    exercises: 8,
    description: "Целенаправленная работа над мышцами пресса и стабилизацией корпуса. Включает упражнения для прямых и косых мышц.",
    category: "Пресс",
    exercises_list: [
      {
        id: "video_001",
        name: "Скручивания на полу",
        video: "video_001.mp4",
        duration: 60,
        rest: 15,
        category: "Пресс",
        difficulty: "Легко",
        muscleGroups: ["Пресс"],
        sets: 3
      },
      {
        id: "video_014",
        name: "Подъем прямых ног лежа",
        video: "video_014.mp4",
        duration: 60,
        rest: 15,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс"],
        sets: 3
      },
      {
        id: "video_092",
        name: "Обратные скручивания",
        video: "video_092.mp4",
        duration: 60,
        rest: 15,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс"],
        sets: 3
      },
      {
        id: "video_073",
        name: "Русский твист",
        video: "video_073.mp4",
        duration: 45,
        rest: 15,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс", "Косые"],
        sets: 3
      },
      {
        id: "video_107",
        name: "Велосипед",
        video: "video_107.mp4",
        duration: 45,
        rest: 15,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс", "Косые"],
        sets: 3
      },
      {
        id: "video_150",
        name: "Велосипед в воздухе",
        video: "video_150.mp4",
        duration: 30,
        rest: 15,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс", "Косые"],
        sets: 3
      },
      {
        id: "video_136",
        name: "Планка",
        video: "video_136.mp4",
        duration: 90,
        rest: 20,
        category: "Пресс",
        difficulty: "Средне",
        muscleGroups: ["Пресс", "Стабилизация"],
        sets: 3
      },
      {
        id: "video_182",
        name: "Боковая планка",
        video: "video_182.mp4",
        duration: 30,
        rest: 20,
        category: "Пресс",
        difficulty: "Сложно",
        muscleGroups: ["Косые", "Стабилизация"],
        sets: 3
      }
    ]
  },
  {
    id: 5,
    name: "Тренировка ног и ягодиц",
    duration: 35,
    difficulty: "Средне",
    exercises: 8,
    description: "Комплексная тренировка для укрепления мышц ног и ягодиц. Включает базовые и изолирующие упражнения для баланса.",
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
        muscleGroups: ["Ноги", "Ягодицы"],
        sets: 3
      },
      {
        id: "video_028",
        name: "Толчок бедрами на одной ноге",
        video: "video_028.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ягодицы"],
        sets: 3
      },
      {
        id: "video_069",
        name: "Толчок бедрами",
        video: "video_069.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ягодицы"],
        sets: 3
      },
      {
        id: "video_140",
        name: "Выпады с гантелями",
        video: "video_140.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Ягодицы"],
        hasWeight: true,
        sets: 3
      },
      {
        id: "video_159",
        name: "Выпады вперед",
        video: "video_159.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Ягодицы"],
        sets: 3
      },
      {
        id: "video_109",
        name: "Подъем на носки стоя",
        video: "video_109.mp4",
        duration: 30,
        rest: 15,
        category: "Сила",
        difficulty: "Легко",
        muscleGroups: ["Икры"],
        sets: 3
      },
      {
        id: "video_098",
        name: "Подъем на носки с гантелями стоя",
        video: "video_098.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Икры"],
        hasWeight: true,
        sets: 4
      },
      {
        id: "video_231",
        name: "Румынская тяга с гантелями",
        video: "video_231.mp4",
        duration: 30,
        rest: 25,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ягодицы", "Бицепс бедра"],
        hasWeight: true,
        sets: 4
      }
    ]
  },
  {
    id: 6,
    name: "Растяжка и восстановление",
    duration: 30,
    difficulty: "Легко",
    exercises: 8,
    description: "Мягкие упражнения для растяжки основных групп мышц и восстановления после интенсивных тренировок. Помогает улучшить гибкость.",
    category: "Растяжка",
    exercises_list: [
      {
        id: "video_230_stretch",
        name: "Марш на месте",
        video: "video_230.mp4",
        duration: 60,
        rest: 10,
        category: "Растяжка",
        difficulty: "Легко",
        muscleGroups: ["Ноги", "Разминка"],
        sets: 1
      },
      {
        id: "video_049_stretch",
        name: "Марш на месте с разведением плеч",
        video: "video_049.mp4",
        duration: 60,
        rest: 10,
        category: "Растяжка",
        difficulty: "Легко",
        muscleGroups: ["Плечи", "Мобильность"],
        sets: 1
      },
      {
        id: "video_136",
        name: "Планка",
        video: "video_136.mp4",
        duration: 60,
        rest: 20,
        category: "Растяжка",
        difficulty: "Средне",
        muscleGroups: ["Пресс", "Стабилизация"],
        sets: 2
      },
      {
        id: "video_008",
        name: "Гиперэкстензия на полу с полотенцем",
        video: "video_008.mp4",
        duration: 45,
        rest: 15,
        category: "Растяжка",
        difficulty: "Средне",
        muscleGroups: ["Пресс", "Спина"],
        sets: 2
      },
      {
        id: "video_247",
        name: "Гиперэкстензия",
        video: "video_247.mp4",
        duration: 45,
        rest: 20,
        category: "Растяжка",
        difficulty: "Средне",
        muscleGroups: ["Спина", "Ягодицы"],
        sets: 2
      },
      {
        id: "video_034",
        name: "Тяга в наклоне с полотенцем",
        video: "video_034.mp4",
        duration: 45,
        rest: 15,
        category: "Растяжка",
        difficulty: "Средне",
        muscleGroups: ["Спина"],
        sets: 2
      },
      {
        id: "video_186",
        name: "Сгибание бицепса в дверном проеме",
        video: "video_186.mp4",
        duration: 30,
        rest: 10,
        category: "Растяжка",
        difficulty: "Легко",
        muscleGroups: ["Бицепс"],
        sets: 2
      },
      {
        id: "video_151",
        name: "Отведение руки с гантелью назад",
        video: "video_151.mp4",
        duration: 40,
        rest: 15,
        category: "Растяжка",
        difficulty: "Средне",
        muscleGroups: ["Плечи"],
        hasWeight: true,
        sets: 2
      }
    ]
  },
  {
    id: 7,
    name: "Силовая тренировка с гантелями",
    duration: 45,
    difficulty: "Средне",
    exercises: 9,
    description: "Комплексная тренировка всего тела с использованием гантелей. Балансирует верх и низ тела для гармоничного развития.",
    category: "Сила",
    exercises_list: [
      {
        id: "video_173",
        name: "Жим гантелей лежа",
        video: "video_173.mp4",
        duration: 30,
        rest: 25,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Грудь", "Трицепс"],
        hasWeight: true,
        sets: 3
      },
      {
        id: "video_021",
        name: "Сгибание рук с гантелями",
        video: "video_021.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Бицепс"],
        hasWeight: true,
        sets: 3
      },
      {
        id: "video_118",
        name: "Боковой подъем гантелей стоя",
        video: "video_118.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Плечи"],
        hasWeight: true,
        sets: 3
      },
      {
        id: "video_128",
        name: "Тяга гантелей в наклоне",
        video: "video_128.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Спина"],
        hasWeight: true,
        sets: 4
      },
      {
        id: "video_129",
        name: "Приседания с гантелями 'Бокал'",
        video: "video_129.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Ягодицы"],
        hasWeight: true,
        sets: 3
      },
      {
        id: "video_140",
        name: "Выпады с гантелями",
        video: "video_140.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Ягодицы"],
        hasWeight: true,
        sets: 3
      },
      {
        id: "video_197",
        name: "Становая тяга с гантелями",
        video: "video_197.mp4",
        duration: 30,
        rest: 25,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Ноги", "Ягодицы", "Спина"],
        hasWeight: true,
        sets: 3
      },
      {
        id: "video_098",
        name: "Подъем на носки с гантелями стоя",
        video: "video_098.mp4",
        duration: 30,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Икры"],
        hasWeight: true,
        sets: 4
      },
      {
        id: "video_136",
        name: "Планка",
        video: "video_136.mp4",
        duration: 60,
        rest: 20,
        category: "Сила",
        difficulty: "Средне",
        muscleGroups: ["Пресс", "Стабилизация"],
        sets: 3
      }
    ]
  }
];