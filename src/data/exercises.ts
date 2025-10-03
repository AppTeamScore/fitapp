export interface Exercise {
  id: string;
  name: string;
  video: string;
  duration: number;
  rest: number;
  category: string;
  difficulty: string;
  muscleGroups: string[];
  hasWeight?: boolean;
}

export const exercises: Exercise[] = [
  // Кардио упражнения
  { id: "video_006", name: "Прыжки звездочка", video: "video_006.mp4", duration: 60, rest: 60, category: "Кардио", difficulty: "Легко", muscleGroups: ["Плечи", "Ягодицы", "Квадрицепсы", "Бицепсы бедра", "Икры", "Сила"] },
  { id: "video_023", name: "Шаг 'Джек'", video: "video_023.mp4", duration: 120, rest: 60, category: "Кардио", difficulty: "Легко", muscleGroups: ["Плечи", "Ягодицы", "Квадрицепсы", "Бицепсы бедра", "Икры", "Сила"] },
  { id: "video_049", name: "Марш на месте с разведением плеч", video: "video_049.mp4", duration: 60, rest: 60, category: "Кардио", difficulty: "Легко", muscleGroups: ["Плечи", "Квадрицепсы", "Икры"] },
  { id: "video_101", name: "Подъем рук с шагом на месте", video: "video_101.mp4", duration: 60, rest: 60, category: "Кардио", difficulty: "Легко", muscleGroups: ["Плечи", "Квадрицепсы", "Икры"] },
  { id: "video_104", name: "Прыжки с приседом", video: "video_104.mp4", duration: 60, rest: 60, category: "Кардио", difficulty: "Средне", muscleGroups: ["Ягодицы", "Квадрицепсы", "Бицепсы бедра", "Икры"] },
  { id: "video_116", name: "Круговые движения рук с шагом назад", video: "video_116.mp4", duration: 60, rest: 60, category: "Кардио", difficulty: "Легко", muscleGroups: ["Плечи"] },
  { id: "video_181", name: "Прыжки на месте с высоким поднятием коленей", video: "video_181.mp4", duration: 60, rest: 60, category: "Кардио", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Бицепсы бедра", "Икры", "Сила"] },
  { id: "video_230", name: "Марш на месте", video: "video_230.mp4", duration: 120, rest: 60, category: "Кардио", difficulty: "Легко", muscleGroups: ["Квадрицепсы", "Икры"] },
  { id: "video_232", name: "Берпи", video: "video_232.mp4", duration: 60, rest: 60, category: "Кардио", difficulty: "Сложно", muscleGroups: ["Грудь", "Плечи", "Трицепс", "Ягодицы", "Квадрицепсы", "Бицепсы бедра", "Икры", "Сила"] },
  { id: "video_248", name: "Гребной тренажер", video: "video_248.mp4", duration: 600, rest: 60, category: "Кардио", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Бицепсы бедра", "Ягодицы", "Икры", "Сила", "Спина", "Плечи", "Бицепс"] },
  { id: "video_249", name: "Бег", video: "video_249.mp4", duration: 600, rest: 60, category: "Кардио", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Бицепсы бедра", "Ягодицы", "Икры"] },
  { id: "video_250", name: "Бег на беговой дорожке", video: "video_250.mp4", duration: 600, rest: 60, category: "Кардио", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Бицепсы бедра", "Ягодицы", "Икры"] },

  // Силовые упражнения для верха тела
  { id: "video_002", name: "Чередующий молотковый подъем гантелей", video: "video_002.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Бицепс", "Предплечья"], hasWeight: true },
  { id: "video_003", name: "Тяга гантелей в наклоне обратным хватом", video: "video_003.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Спина", "Бицепс"], hasWeight: true },
  { id: "video_012", name: "Отжимания Алмаз", video: "video_012.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Трицепс", "Грудь"] },
  { id: "video_015", name: "Тяга в тренажере сидя", video: "video_015.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Спина"] },
  { id: "video_017", name: "Разведение рук на тренажере сидя", video: "video_017.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Грудь"] },
  { id: "video_019", name: "Сгибание рук с гантелями на концентрацию", video: "video_019.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Бицепс"], hasWeight: true },
  { id: "video_021", name: "Сгибание рук с гантелями", video: "video_021.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Бицепс"], hasWeight: true },
  { id: "video_024", name: "Обратные отжимания", video: "video_024.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Трицепс", "Грудь"] },
  { id: "video_026", name: "Подтягивания обратным хватом", video: "video_026.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Спина", "Бицепс"] },
  { id: "video_027", name: "Французский жим", video: "video_027.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Трицепс"], hasWeight: true },
  { id: "video_033", name: "Отжимания на полу для трицепса", video: "video_033.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Трицепс", "Грудь"] },
  { id: "video_034", name: "Тяга в наклоне с полотенцем", video: "video_034.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Спина"] },
  { id: "video_036", name: "Разгибание гантелей на трицепс стоя", video: "video_036.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Трицепс"], hasWeight: true },
  { id: "video_038", name: "Боковой подъем одной рукой с тросом", video: "video_038.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Плечи"] },
  { id: "video_059", name: "Подъем штанги на бицепс", video: "video_059.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Бицепс"], hasWeight: true },
  { id: "video_062", name: "Тяга гантели в наклоне на скамье", video: "video_062.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Спина"], hasWeight: true },
  { id: "video_063", name: "Подтягивание на брусьях с поддержкой", video: "video_063.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Трицепс", "Грудь"] },
  { id: "video_064", name: "Жим гантелей на наклонной скамье", video: "video_064.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Грудь", "Плечи", "Трицепс"], hasWeight: true },
  { id: "video_067", name: "Обратная тяга между стульями", video: "video_067.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Спина", "Бицепс"] },
  { id: "video_070", name: "Отжимания с широкой постановкой рук", video: "video_070.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Грудь", "Плечи", "Трицепс"] },
  { id: "video_071", name: "Шраги со штангой", video: "video_071.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Трапеции"], hasWeight: true },
  { id: "video_075", name: "Тяга верхнего блока к груди", video: "video_075.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Спина"] },
  { id: "video_077", name: "Тяга кабеля сидя в блоке", video: "video_077.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Спина"] },
  { id: "video_081", name: "Жим гантелей 'Арнольд'", video: "video_081.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Плечи"], hasWeight: true },
  { id: "video_085", name: "Отведение гантелей назад в наклоне", video: "video_085.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Плечи", "Спина"], hasWeight: true },
  { id: "video_096", name: "Жим штанги лежа", video: "video_096.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Грудь", "Трицепс", "Плечи"], hasWeight: true },
  { id: "video_087", name: "Отжимания на брусьях с пола", video: "video_087.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Трицепс", "Грудь"] },
  { id: "video_093", name: "Отжимания на наклонной поверхности", video: "video_093.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Грудь", "Трицепс", "Плечи"] },
  { id: "video_095", name: "Обратный сгиб запястья с гантелью", video: "video_095.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Предплечья"], hasWeight: true },
  { id: "video_097", name: "Подтягивания", video: "video_097.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Спина", "Бицепс"] },
  { id: "video_102", name: "Среднее разведение рук с тросом", video: "video_102.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Грудь"] },
  { id: "video_103", name: "Подъем бицепса стоя (с работой ноги)", video: "video_103.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Бицепс"], hasWeight: true },
  { id: "video_105", name: "Жим на тросе с поворотом из-за головы", video: "video_105.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Плечи"] },
  { id: "video_108", name: "Жим на тренажере", video: "video_108.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Грудь", "Плечи", "Трицепс"] },
  { id: "video_118", name: "Боковой подъем гантелей стоя", video: "video_118.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Плечи"], hasWeight: true },
  { id: "video_124", name: "Отжимание троса вниз на трицепс", video: "video_124.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Трицепс"] },
  { id: "video_128", name: "Тяга гантелей в наклоне", video: "video_128.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Спина"], hasWeight: true },
  { id: "video_130", name: "Тяга штанги в наклоне", video: "video_130.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Спина"], hasWeight: true },
  { id: "video_134", name: "Молотковый подъем на бицепс лежа с полотенцем для обеих рук", video: "video_134.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Бицепс", "Предплечья"] },
  { id: "video_135", name: "Разведение гантелей через стороны в наклоне", video: "video_135.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Плечи", "Спина"], hasWeight: true },
  { id: "video_144", name: "Разгибание одной руки с гантелью за головой сидя", video: "video_144.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Трицепс"], hasWeight: true },
  { id: "video_146", name: "Разведение гантелей лежа", video: "video_146.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Грудь"], hasWeight: true },
  { id: "video_151", name: "Отведение руки с гантелью назад", video: "video_151.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Плечи", "Спина"], hasWeight: true },
  { id: "video_152", name: "Сгибание запястий с гирей", video: "video_152.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Предплечья"], hasWeight: true },
  { id: "video_158", name: "Захват диска", video: "video_158.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Предплечья"] },
  { id: "video_160", name: "Отжимания от стены", video: "video_160.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Грудь", "Трицепс", "Плечи"] },
  { id: "video_164", name: "Сгибание рук на бицепс с собственной ногой", video: "video_164.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Бицепс"] },
  { id: "video_165", name: "Подъем гантелей перед собой", video: "video_165.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Плечи"], hasWeight: true },
  { id: "video_166", name: "Чередующиеся сгибания рук с гантелями на наклонной скамье", video: "video_166.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Бицепс"], hasWeight: true },
  { id: "video_168", name: "Махи гирей", video: "video_168.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Ягодицы", "Бицепсы бедра", "Спина", "Плечи"], hasWeight: true },
  { id: "video_169", name: "Обратные сгибания запястий со штангой EZ сидя", video: "video_169.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Предплечья"], hasWeight: true },
  { id: "video_172", name: "Молотковый подъем с тросом", video: "video_172.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Бицепс", "Предплечья"] },
  { id: "video_173", name: "Жим гантелей лежа", video: "video_173.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Грудь", "Трицепс", "Плечи"], hasWeight: true },
  { id: "video_175", name: "Жим штанги лежа узким хватом", video: "video_175.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Трицепс", "Грудь"], hasWeight: true },
  { id: "video_176", name: "Подтягивания с акцентом на лопатки", video: "video_176.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Спина"] },
  { id: "video_177", name: "Шраги с гантелями", video: "video_177.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Трапеции"], hasWeight: true },
  { id: "video_178", name: "Отжимания на коленях", video: "video_178.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Грудь", "Трицепс", "Плечи"] },
  { id: "video_185", name: "Отжимания Щука", video: "video_185.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Плечи", "Трицепс"] },
  { id: "video_186", name: "Сгибание бицепса в дверном проеме", video: "video_186.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Бицепс"] },
  { id: "video_189", name: "Подъем штанги на бицепс на скамье", video: "video_189.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Бицепс"], hasWeight: true },
  { id: "video_199", name: "Обратные разведения с гантелями на наклонной скамье", video: "video_199.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Плечи", "Спина"], hasWeight: true },
  { id: "video_200", name: "Сгибание рук на бицепс на скамье Скотта", video: "video_200.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Бицепс"], hasWeight: true },
  { id: "video_201", name: "Жим гантелей стоя над головой", video: "video_201.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Плечи", "Трицепс"], hasWeight: true },
  { id: "video_204", name: "Опускание на брусьях с акцентом на лопатки", video: "video_204.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Спина"] },
  { id: "video_206", name: "Сгибание запястий со штангой", video: "video_206.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Предплечья"], hasWeight: true },
  { id: "video_207", name: "Отжимания", video: "video_207.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Грудь", "Трицепс", "Плечи"] },
  { id: "video_229", name: "Тяга сидя с полотенцем", video: "video_229.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Спина"] },
  { id: "video_236", name: "Жим гантелей лежа узким хватом", video: "video_236.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Трицепс", "Грудь"], hasWeight: true },
  { id: "video_239", name: "Отжимания на брусьях для трицепса с поддержкой", video: "video_239.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Трицепс"] },
  { id: "video_240", name: "Разгибание рук на трицепс на тренажере", video: "video_240.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Трицепс"] },
  { id: "video_241", name: "Подъем плеч в тренажере Смита", video: "video_241.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Трапеции"] },
  { id: "video_244", name: "Жим гантелей со сжатием", video: "video_244.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Грудь"], hasWeight: true },
  { id: "video_245", name: "Отжимания на брусьях", video: "video_245.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Трицепс", "Грудь"] },

  // Упражнения для ног и ягодиц
  { id: "video_016", name: "Боковые выпады", video: "video_016.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Ягодицы", "Приводящие"] },
  { id: "video_028", name: "Толчок бедрами на одной ноге", video: "video_028.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Ягодицы", "Бицепсы бедра"] },
  { id: "video_030", name: "Сгибание ног сидя на тренажере", video: "video_030.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Бицепсы бедра"] },
  { id: "video_031", name: "Румынская тяга со штангой", video: "video_031.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Ягодицы", "Бицепсы бедра", "Спина"], hasWeight: true },
  { id: "video_032", name: "Подъем на носки со штангой стоя", video: "video_032.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Икры"], hasWeight: true },
  { id: "video_052", name: "Сгибание ног стоя на коленях на тренажере с диском", video: "video_052.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Ягодицы", "Бицепсы бедра"] },
  { id: "video_058", name: "Жим гантелей Свенда", video: "video_058.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Грудь"], hasWeight: true },
  { id: "video_069", name: "Толчок бедрами", video: "video_069.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Ягодицы", "Бицепсы бедра"] },
  { id: "video_076", name: "Приседания", video: "video_076.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Квадрицепсы", "Ягодицы", "Бицепсы бедра"] },
  { id: "video_080", name: "Приседания со штангой", video: "video_080.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Квадрицепсы", "Ягодицы", "Бицепсы бедра"], hasWeight: true },
  { id: "video_083", name: "Сгибание ног на тренажере сидя", video: "video_083.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Бицепсы бедра"] },
  { id: "video_084", name: "Подъем икры с гантелью на одной ноге", video: "video_084.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Икры"], hasWeight: true },
  { id: "video_098", name: "Подъем на носки с гантелями стоя", video: "video_098.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Икры"], hasWeight: true },
  { id: "video_109", name: "Подъем на носки стоя", video: "video_109.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Икры"] },
  { id: "video_119", name: "Жим ногами на тренажере", video: "video_119.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Ягодицы", "Бицепсы бедра"] },
  { id: "video_126", name: "Подъем на икры ослик", video: "video_126.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Икры"] },
  { id: "video_129", name: "Приседания с гантелями 'Бокал'", video: "video_129.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Ягодицы", "Бицепсы бедра"], hasWeight: true },
  { id: "video_131", name: "Толчки бедрами с гантелями", video: "video_131.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Ягодицы", "Бицепсы бедра"], hasWeight: true },
  { id: "video_133", name: "Подъем на платформу с гантелями (V2)", video: "video_133.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Ягодицы", "Бицепсы бедра"], hasWeight: true },
  { id: "video_140", name: "Выпады с гантелями", video: "video_140.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Ягодицы", "Бицепсы бедра"], hasWeight: true },
  { id: "video_154", name: "Разножка с приседанием", video: "video_154.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Ягодицы", "Приводящие"] },
  { id: "video_159", name: "Выпады вперед", video: "video_159.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Ягодицы", "Бицепсы бедра"] },
  { id: "video_162", name: "Казачий присед", video: "video_162.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Квадрицепсы", "Ягодицы", "Приводящие"] },
  { id: "video_179", name: "Приседания сумо с гантелями", video: "video_179.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Ягодицы", "Приводящие"], hasWeight: true },
  { id: "video_190", name: "Приседания 'Доброе утро'", video: "video_190.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Ягодицы", "Бицепсы бедра", "Спина"] },
  { id: "video_196", name: "Болгарский выпад", video: "video_196.mp4", duration: 35, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Квадрицепсы", "Ягодицы", "Бицепсы бедра"] },
  { id: "video_197", name: "Становая тяга с гантелями", video: "video_197.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Спина", "Ягодицы", "Бицепсы бедра"], hasWeight: true },
  { id: "video_208", name: "Сгибание ног лежа на тренажере", video: "video_208.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Бицепсы бедра"] },
  { id: "video_218", name: "Приседания сумо", video: "video_218.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Ягодицы", "Приводящие"] },
  { id: "video_226", name: "Жим ногами", video: "video_226.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Ягодицы", "Бицепсы бедра"] },
  { id: "video_231", name: "Румынская тяга с гантелями", video: "video_231.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Ягодицы", "Бицепсы бедра", "Спина"], hasWeight: true },
  { id: "video_242", name: "Шаги с выпадами", video: "video_242.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Ягодицы", "Бицепсы бедра"] },
  { id: "video_246", name: "Подъем таза с сгибанием ног", video: "video_246.mp4", duration: 40, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Ягодицы", "Бицепсы бедра"] },
  { id: "video_247", name: "Гиперэкстензия", video: "video_247.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Спина", "Ягодицы", "Бицепсы бедра"] },
  { id: "video_251", name: "Прыжки с разножкой на платформу", video: "video_251.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Квадрицепсы", "Ягодицы", "Бицепсы бедра"] },

  // Упражнения для Преса
  { id: "video_001", name: "Скручивания на полу", video: "video_001.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Пресс", "Прямая мышца живота"] },
  { id: "video_008", name: "Гиперэкстензия на полу с полотенцем", video: "video_008.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Пресс", "Спина", "Ягодицы"] },
  { id: "video_014", name: "Подъем прямых ног лежа", video: "video_014.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Пресс", "Прямая мышца живота"] },
  { id: "video_043", name: "Упражнение 'Мертвый жук'", video: "video_043.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Пресс", "Прямая мышца живота", "Поперечная мышца живота"] },
  { id: "video_048", name: "Скролл Крашер с гантелями на полу", video: "video_048.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Пресс", "Прямая мышца живота"], hasWeight: true },
  { id: "video_073", name: "Русский твист", video: "video_073.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Пресс", "Прямая мышца живота", "Косые мышцы живота"] },
  { id: "video_089", name: "Чередующие касания пяток", video: "video_089.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Легко", muscleGroups: ["Пресс", "Косые мышцы живота"] },
  { id: "video_092", name: "Обратные скручивания", video: "video_092.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Пресс", "Прямая мышца живота"] },
  { id: "video_107", name: "Велосипед", video: "video_107.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Пресс", "Прямая мышца живота", "Косые мышцы живота"] },
  { id: "video_136", name: "Планка", video: "video_136.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Пресс", "Прямая мышца живота", "Поперечная мышца живота", "Спина"] },
  { id: "video_139", name: "Становая тяга в стиле 'Рывок'", video: "video_139.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Пресс", "Спина", "Ягодицы", "Бицепсы бедра", "Плечи", "Прямая мышца живота"], hasWeight: true },
  { id: "video_142", name: "Подъем прямых ног в висе", video: "video_142.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Пресс", "Прямая мышца живота"] },
  { id: "video_143", name: "Скручивания с прямыми руками и гантелями", video: "video_143.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Пресс", "Прямая мышца живота"], hasWeight: true },
  { id: "video_150", name: "Велосипед в воздухе", video: "video_150.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Пресс", "Прямая мышца живота", "Косые мышцы живота"] },
  { id: "video_182", name: "Боковая планка", video: "video_182.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Пресс", "Косые мышцы живота", "Поперечная мышца живота"] },
  { id: "video_183", name: "Русский твист с гантелью", video: "video_183.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Пресс", "Прямая мышца живота", "Косые мышцы живота"], hasWeight: true },
  { id: "video_187", name: "Скручивания с подтягиванием коленей", video: "video_187.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Пресс", "Прямая мышца живота"] },
  { id: "video_205", name: "Чередующиеся косые скручивания", video: "video_205.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Пресс", "Косые мышцы живота"] },
  { id: "video_210", name: "Скручивания с поворотом", video: "video_210.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Средне", muscleGroups: ["Пресс", "Прямая мышца живота", "Косые мышцы живота"] },
  { id: "video_213", name: "Русский твист с весом (ноги подняты)", video: "video_213.mp4", duration: 60, rest: 60, category: "Сила", difficulty: "Сложно", muscleGroups: ["Пресс", "Прямая мышца живота", "Косые мышцы живота"], hasWeight: true },

  // HIIT упражнения
  { id: "video_120_hiit", name: "Дровосек с собственным весом", video: "video_120.mp4", duration: 60, rest: 60, category: "HIIT", difficulty: "Сложно", muscleGroups: ["Пресс", "Спина", "Плечи", "Прямая мышца живота", "Косые мышцы живота"] },
  { id: "video_232_hiit", name: "Берпи", video: "video_232.mp4", duration: 60, rest: 60, category: "HIIT", difficulty: "Сложно", muscleGroups: ["Грудь", "Плечи", "Трицепс", "Ягодицы", "Квадрицепсы", "Бицепсы бедра", "Икры", "Сила"] },
  { id: "video_006_hiit", name: "Прыжки звездочка", video: "video_006.mp4", duration: 60, rest: 60, category: "HIIT", difficulty: "Средне", muscleGroups: ["Плечи", "Ягодицы", "Квадрицепсы", "Бицепсы бедра", "Икры", "Сила"] },
  { id: "video_104_hiit", name: "Прыжки с приседом", video: "video_104.mp4", duration: 60, rest: 60, category: "HIIT", difficulty: "Средне", muscleGroups: ["Ягодицы", "Квадрицепсы", "Бицепсы бедра", "Икры"] },
  { id: "video_181_hiit", name: "Прыжки на месте с высоким поднятием коленей", video: "video_181.mp4", duration: 60, rest: 60, category: "HIIT", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Бицепсы бедра", "Икры", "Сила"] },
  { id: "video_141", name: "Хлопки пальцами", video: "video_141.mp4", duration: 60, rest: 60, category: "HIIT", difficulty: "Легко", muscleGroups: [] },
  { id: "video_147", name: "Обратные выпады с движением рук вперед", video: "video_147.mp4", duration: 60, rest: 60, category: "HIIT", difficulty: "Средне", muscleGroups: ["Квадрицепсы", "Ягодицы", "Плечи"] },

  // Растяжка и мобильность
  { id: "video_049_stretch", name: "Марш на месте с разведением плеч", video: "video_049.mp4", duration: 60, rest: 60, category: "Растяжка", difficulty: "Легко", muscleGroups: ["Плечи"] },
  { id: "video_230_stretch", name: "Марш на месте", video: "video_230.mp4", duration: 60, rest: 60, category: "Растяжка", difficulty: "Легко", muscleGroups: ["Квадрицепсы", "Икры"] },
];

// Поддерживаем старое имя для совместимости
export const exerciseData = exercises;

// Функция для получения уникальных упражнений (удаляет дубли по ID)
export const getUniqueExercises = (): Exercise[] => {
  const uniqueMap = new Map<string, Exercise>();
  exercises.forEach(exercise => {
    if (!uniqueMap.has(exercise.id)) {
      uniqueMap.set(exercise.id, exercise);
    }
  });
  return Array.from(uniqueMap.values());
};

// Получаем уникальные упражнения
const uniqueExercises = getUniqueExercises();

// Группировка упражнений по категориям
export const exercisesByCategory = {
  "Кардио": uniqueExercises.filter(ex => ex.category === "Кардио"),
  "Сила": uniqueExercises.filter(ex => ex.category === "Сила"),
  "HIIT": uniqueExercises.filter(ex => ex.category === "HIIT"),
  "Растяжка": uniqueExercises.filter(ex => ex.category === "Растяжка"),
};

// Функция для получения упражнений по сложности
export const getExercisesByDifficulty = (difficulty: string) => {
  return exercises.filter(ex => ex.difficulty === difficulty);
};

// Функция для получения случайных упражнений из категории
export const getRandomExercises = (category: string, count: number): Exercise[] => {
  const categoryExercises = exercisesByCategory[category as keyof typeof exercisesByCategory] || [];
  const shuffled = [...categoryExercises].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};