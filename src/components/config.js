export const COMPETENCIES = {
  ambition: {
    name: "Амбициозность",
    description: "Способность ставить высокие цели и достигать их",
    color: "bg-blue-100",
  },
  clientFocus: {
    name: "Клиентоцентричность",
    description: "Понимание и удовлетворение потребностей клиента",
    color: "bg-green-100",
  },
  innovation: {
    name: "Открытость новому",
    description: "Готовность к изменениям и инновациям",
    color: "bg-purple-100",
  },
  collaboration: {
    name: "Открытость к сотрудничеству",
    description: "Умение работать в команде и выстраивать отношения",
    color: "bg-yellow-100",
  },
  analysis: {
    name: "Анализ информации",
    description: "Способность работать с данными и принимать решения",
    color: "bg-red-100",
  },
  selfDev: {
    name: "Саморазвитие",
    description: "Постоянное обучение и профессиональный рост",
    color: "bg-indigo-100",
  },
  stressManagement: {
    name: "Управление стрессом",
    description: "Эффективная работа в сложных ситуациях",
    color: "bg-orange-100",
  },
  leadership: {
    name: "Лидерство",
    description: "Способность вести за собой и развивать команду",
    color: "bg-emerald-100",
  },
};

export const CAREER_LEVELS = {
  1: "Стажёр",
  2: "Стажёр II",
  3: "Младший специалист",
  4: "Младший специалист II",
  5: "Специалист",
  6: "Специалист II",
  7: "Ведущий специалист",
  8: "Ведущий специалист II",
  9: "Руководитель группы",
  10: "Руководитель группы II",
};

export const LEVEL_REQUIREMENTS = {
  2: { score: 100, competencyMin: 20 }, // После первых 2-3 ситуаций
  3: { score: 200, competencyMin: 30 }, // После 4-5 ситуаций
  4: { score: 350, competencyMin: 40 }, // После 6-7 ситуаций
  5: { score: 500, competencyMin: 50 }, // После 8-9 ситуаций
  6: { score: 650, competencyMin: 60 }, // После 10 ситуаций
  7: { score: 750, competencyMin: 65 }, // После 11 ситуаций
  8: { score: 850, competencyMin: 70 }, // Требуется эффективное прохождение
  9: { score: 900, competencyMin: 75 }, // Близко к максимуму
  10: { score: 950, competencyMin: 80 }, // Практически идеальное прохождение
};

export const ACHIEVEMENTS = {
  FIRST_CHOICE: {
    id: "first_choice",
    title: "Первое решение",
    description: "Примите первое самостоятельное решение",
    points: 50,
  },
  LEVEL_UP: {
    id: "level_up",
    title: "Повышение",
    description: "Достигните следующего уровня карьеры",
    points: 100,
  },
  COMPETENCY_MASTER: {
    id: "competency_master",
    title: "Мастер компетенций",
    description: "Достигните 75% в любой компетенции",
    points: 150,
  },
  TEAM_PLAYER: {
    id: "team_player",
    title: "Командный игрок",
    description: "Достигните высокого уровня в коллаборации",
    points: 200,
  },
  INNOVATOR: {
    id: "innovator",
    title: "Инноватор",
    description: "Предложите несколько инновационных решений",
    points: 200,
  },
};
