import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Star, Trophy, Info, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";

import {
  COMPETENCIES,
  CAREER_LEVELS,
  LEVEL_REQUIREMENTS,
  ACHIEVEMENTS,
} from "./config";
import { SITUATIONS } from "./situations";

const CareerGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [currentSituation, setCurrentSituation] = useState(0);
  const [competencies, setCompetencies] = useState({
    ambition: 0,
    clientFocus: 0,
    innovation: 0,
    collaboration: 0,
    analysis: 0,
    selfDev: 0,
    stressManagement: 0,
    leadership: 0,
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [level, setLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [achievements, setAchievements] = useState([]);

  const checkLevelUp = (score, newCompetencies) => {
    for (const [newLevel, requirements] of Object.entries(LEVEL_REQUIREMENTS)) {
      if (
        score >= requirements.score &&
        Object.values(newCompetencies).every(
          (value) => value >= requirements.competencyMin
        ) &&
        level < parseInt(newLevel)
      ) {
        return parseInt(newLevel);
      }
    }
    return level;
  };

  // const analyzeResults = () => {
  //   const strongCompetencies = Object.entries(competencies)
  //     .filter(([_, value]) => value >= 70)
  //     .map(([key]) => COMPETENCIES[key].name);

  //   const weakCompetencies = Object.entries(competencies)
  //     .filter(([_, value]) => value < 50)
  //     .map(([key]) => COMPETENCIES[key].name);

  //   let recommendedRole = "специалист";
  //   if (competencies.leadership >= 70 && competencies.collaboration >= 70) {
  //     recommendedRole = "тимлид";
  //   } else if (competencies.innovation >= 70 && competencies.analysis >= 70) {
  //     recommendedRole = "аналитик-инноватор";
  //   } else if (
  //     competencies.clientFocus >= 70 &&
  //     competencies.collaboration >= 70
  //   ) {
  //     recommendedRole = "клиентский менеджер";
  //   }

  //   return {
  //     strongCompetencies,
  //     weakCompetencies,
  //     recommendedRole,
  //     totalScore,
  //     achievementsCount: achievements.length,
  //   };
  // };

// const analyzeResults = () => {
//   // Находим сильные компетенции (более 70%)
//   const strongCompetencies = Object.entries(competencies)
//     .filter(([_, value]) => value >= 70)
//     .map(([key]) => COMPETENCIES[key].name);

//   // Находим компетенции, требующие развития (менее 50%)
//   const weakCompetencies = Object.entries(competencies)
//     .filter(([_, value]) => value < 50)
//     .map(([key]) => COMPETENCIES[key].name);

//   return {
//     strongCompetencies,
//     weakCompetencies,
//     totalScore,
//     achievementsCount: achievements.length,
//   };
// };

const analyzeResults = () => {
  // Разделим компетенции на категории по уровню развития
  const competencyLevels = Object.entries(competencies).reduce(
    (acc, [key, value]) => {
      if (value >= 80) {
        acc.exceptional.push({
          name: COMPETENCIES[key].name,
          value: value,
        });
      } else if (value >= 65) {
        acc.strong.push({
          name: COMPETENCIES[key].name,
          value: value,
        });
      } else if (value >= 50) {
        acc.moderate.push({
          name: COMPETENCIES[key].name,
          value: value,
        });
      } else {
        acc.needsWork.push({
          name: COMPETENCIES[key].name,
          value: value,
        });
      }
      return acc;
    },
    {
      exceptional: [], // 80-100% - Исключительно сильные компетенции
      strong: [], // 65-79% - Сильные компетенции
      moderate: [], // 50-64% - Средний уровень развития
      needsWork: [], // 0-49% - Требуют развития
    }
  );

  // Добавим рекомендации на основе уровня
  let recommendations = [];

  if (competencyLevels.exceptional.length > 3) {
    recommendations.push(
      "Обратите внимание на баланс компетенций - старайтесь развиваться разносторонне."
    );
  }

  if (competencyLevels.needsWork.length === 0 && level < 5) {
    recommendations.push(
      "Возможно, вы выбираете слишком безопасные решения. Пробуйте выходить из зоны комфорта."
    );
  }

  if (
    competencyLevels.moderate.length + competencyLevels.needsWork.length >
    4
  ) {
    recommendations.push(
      "Сфокусируйтесь на развитии нескольких ключевых компетенций, вместо попытки улучшить всё сразу."
    );
  }

  return {
    competencyLevels,
    recommendations,
    totalScore,
    achievementsCount: achievements.length,
  };
};

  const handleRestart = () => {
    setGameStarted(false);
    setGameFinished(false);
    setCurrentSituation(0);
    setCompetencies({
      ambition: 0,
      clientFocus: 0,
      innovation: 0,
      collaboration: 0,
      analysis: 0,
      selfDev: 0,
      stressManagement: 0,
      leadership: 0,
    });
    setShowFeedback(false);
    setFeedback(null);
    setLevel(1);
    setTotalScore(0);
    setAchievements([]);
  };

const handleChoice = (option) => {
  const newCompetencies = { ...competencies };
  let pointsGained = 0;

  // Обрабатываем влияние выбора на компетенции
  Object.entries(option.impact).forEach(([comp, value]) => {
    // Базовый максимум для всех компетенций - 85%
    const baseMax = 85;

    // Рассчитываем фактическое увеличение
    let actualIncrease = value;

    // Если компетенция уже высокая, прогресс замедляется
    if (competencies[comp] > 70) {
      actualIncrease = Math.round(value * 0.7); // Замедление на 30%
    }

    // Применяем увеличение с ограничением
    newCompetencies[comp] = Math.min(
      baseMax,
      competencies[comp] + actualIncrease
    );
    pointsGained += actualIncrease;
  });

  const newTotalScore = totalScore + pointsGained;

  // Проверяем повышение уровня
  let newLevel = level;
  for (const [nextLevel, requirements] of Object.entries(LEVEL_REQUIREMENTS)) {
    if (
      newTotalScore >= requirements.score &&
      Object.values(newCompetencies).every(
        (value) => value >= requirements.competencyMin
      ) &&
      parseInt(nextLevel) > level
    ) {
      newLevel = parseInt(nextLevel);
    }
  }

  // Проверяем достижения
  const newAchievements = [...achievements];

  // Первое решение
  if (!achievements.includes("first_choice")) {
    newAchievements.push("first_choice");
  }

  // Повышение уровня
  if (newLevel > level && !achievements.includes("level_up")) {
    newAchievements.push("level_up");
  }

  // Мастер компетенций
  if (
    Object.values(newCompetencies).some((value) => value >= 75) &&
    !achievements.includes("competency_master")
  ) {
    newAchievements.push("competency_master");
  }

  // Обновляем все состояния
  setTotalScore(newTotalScore);
  setCompetencies(newCompetencies);
  setLevel(newLevel);
  setAchievements(newAchievements);

  // Формируем обратную связь
  setFeedback({
    impacts: option.impact,
    text: option.feedback,
    pointsGained,
    levelUp: newLevel > level,
    newAchievements: newAchievements.filter((a) => !achievements.includes(a)),
  });
  setShowFeedback(true);
};

  const handleNextSituation = () => {
    if (currentSituation + 1 < SITUATIONS.length) {
      setCurrentSituation(currentSituation + 1);
      setShowFeedback(false);
    } else {
      setGameFinished(true);
    }
  };

  // Стартовый экран
  if (!gameStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Карьерный путь</CardTitle>
          <CardDescription className="text-center">
            Симулятор развития компетенций
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>О симуляторе</AlertTitle>
            <AlertDescription>
              Развивайте профессиональные компетенции через принятие решений в
              реальных рабочих ситуациях. Каждое решение влияет на ваши навыки и
              карьерный рост.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold">Как набрать максимум баллов:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Выбирайте сбалансированные решения, развивающие несколько
                компетенций
              </li>
              <li>Следите за тем, чтобы все компетенции росли равномерно</li>
              <li>Учитывайте обратную связь после каждого решения</li>
              <li>
                Для повышения уровня нужно набрать определенное количество
                баллов и минимальный уровень компетенций
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Уровни карьеры:</h3>
            <ul className="list-disc pl-6 space-y-2">
              {Object.entries(LEVEL_REQUIREMENTS).map(([level, req]) => (
                <li key={level}>
                  Уровень {level}: необходимо {req.score} очков и минимум{" "}
                  {req.competencyMin}% по каждой компетенции
                </li>
              ))}
            </ul>
          </div>

          <Button onClick={() => setGameStarted(true)} className="w-full">
            Начать игру
          </Button>
        </CardContent>
      </Card>
    );
  }

  // // Экран результатов
  // if (gameFinished) {
  //   const results = analyzeResults();
  //   return (
  //     <Card className="w-full max-w-2xl mx-auto">
  //       <CardHeader>
  //         <CardTitle className="text-center">
  //           Анализ вашего карьерного пути
  //         </CardTitle>
  //       </CardHeader>
  //       <CardContent className="space-y-6">
  //         {/* Общая статистика */}
  //         <div className="bg-blue-50 p-4 rounded-lg space-y-2">
  //           <h3 className="font-semibold">Ваши достижения:</h3>
  //           <ul className="list-disc pl-6">
  //             <li>Достигнут уровень: {CAREER_LEVELS[level]}</li>
  //             <li>Набрано очков: {totalScore}</li>
  //             <li>Получено достижений: {achievements.length}</li>
  //           </ul>
  //         </div>

  //         {/* Компетенции */}
  //         <div className="grid grid-cols-2 gap-4">
  //           {Object.entries(competencies).map(([key, value]) => (
  //             <div
  //               key={key}
  //               className={`p-3 rounded ${COMPETENCIES[key].color}`}
  //             >
  //               <div className="text-sm font-medium mb-1">
  //                 {COMPETENCIES[key].name}
  //               </div>
  //               <Progress value={value} className="h-2" />
  //               <div className="text-xs mt-1">{value}%</div>
  //             </div>
  //           ))}
  //         </div>

  //         {/* Сильные стороны */}
  //         {results.strongCompetencies.length > 0 && (
  //           <div className="bg-green-50 p-4 rounded-lg">
  //             <h3 className="font-semibold mb-2">Ваши сильные стороны:</h3>
  //             <ul className="list-disc pl-6">
  //               {results.strongCompetencies.map((comp) => (
  //                 <li key={comp}>{comp}</li>
  //               ))}
  //             </ul>
  //           </div>
  //         )}

  //         {/* Зоны роста */}
  //         {results.weakCompetencies.length > 0 && (
  //           <div className="bg-yellow-50 p-4 rounded-lg">
  //             <h3 className="font-semibold mb-2">Зоны роста:</h3>
  //             <ul className="list-disc pl-6">
  //               {results.weakCompetencies.map((comp) => (
  //                 <li key={comp}>{comp}</li>
  //               ))}
  //             </ul>
  //           </div>
  //         )}

  //         {/* Рекомендации */}
  //         <Alert>
  //           <AlertTitle>Рекомендации по развитию карьеры</AlertTitle>
  //           <AlertDescription>
  //             <p>
  //               Для дальнейшего роста фокусируйтесь на развитии следующих
  //               компетенций:
  //             </p>
  //             <ul className="list-disc pl-6 mt-2">
  //               {results.weakCompetencies.map((comp) => (
  //                 <li key={comp}>{comp}</li>
  //               ))}
  //             </ul>
  //           </AlertDescription>
  //         </Alert>

  //         {/* Достижения */}
  //         <div className="bg-purple-50 p-4 rounded-lg">
  //           <h3 className="font-semibold mb-2">Полученные достижения:</h3>
  //           <div className="flex flex-wrap gap-2">
  //             {achievements.map((id) => {
  //               const achievement = Object.values(ACHIEVEMENTS).find(
  //                 (a) => a.id === id
  //               );
  //               return (
  //                 <Badge key={id} variant="secondary" className="p-2">
  //                   <Trophy className="w-4 h-4 mr-2 inline-block" />
  //                   {achievement.title}
  //                 </Badge>
  //               );
  //             })}
  //           </div>
  //         </div>

  //         <Button onClick={handleRestart} className="w-full">
  //           Начать заново
  //         </Button>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  if (gameFinished) {
    const results = analyzeResults();
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            Анализ вашего карьерного пути
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Общая статистика */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Ваши достижения:</h3>
            <ul className="list-disc pl-6">
              <li>Достигнут уровень: {CAREER_LEVELS[level]}</li>
              <li>Набрано очков: {totalScore}</li>
              <li>Получено достижений: {achievements.length}</li>
            </ul>
          </div>

          {/* Компетенции по уровням */}
          <div className="space-y-4">
            {results.competencyLevels.exceptional.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Исключительно развитые компетенции:
                </h3>
                <ul className="list-disc pl-6">
                  {results.competencyLevels.exceptional.map((comp) => (
                    <li key={comp.name}>
                      {comp.name} ({comp.value}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.competencyLevels.strong.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Сильные компетенции:</h3>
                <ul className="list-disc pl-6">
                  {results.competencyLevels.strong.map((comp) => (
                    <li key={comp.name}>
                      {comp.name} ({comp.value}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.competencyLevels.moderate.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Компетенции среднего уровня:
                </h3>
                <ul className="list-disc pl-6">
                  {results.competencyLevels.moderate.map((comp) => (
                    <li key={comp.name}>
                      {comp.name} ({comp.value}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.competencyLevels.needsWork.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Требуют развития:</h3>
                <ul className="list-disc pl-6">
                  {results.competencyLevels.needsWork.map((comp) => (
                    <li key={comp.name}>
                      {comp.name} ({comp.value}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Рекомендации */}
          {results.recommendations.length > 0 && (
            <Alert>
              <AlertTitle>Рекомендации по развитию</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4 space-y-1">
                  {results.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Достижения */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Полученные достижения:</h3>
            <div className="flex flex-wrap gap-2">
              {achievements.map((id) => {
                const achievement = Object.values(ACHIEVEMENTS).find(
                  (a) => a.id === id
                );
                return (
                  <Badge key={id} variant="secondary" className="p-2">
                    <Trophy className="w-4 h-4 mr-2 inline-block" />
                    {achievement.title}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Button onClick={handleRestart} className="w-full">
            Начать заново
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Игровой экран
  const situation = SITUATIONS[currentSituation];
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline">{CAREER_LEVELS[level]}</Badge>
            <Badge variant="outline">Уровень {level}</Badge>
            <Badge variant="outline">Очки: {totalScore}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(competencies).map(([key, value]) => (
              <div
                key={key}
                className={`p-3 rounded ${COMPETENCIES[key].color}`}
              >
                <div className="text-sm font-medium mb-1">
                  {COMPETENCIES[key].name}
                </div>
                <Progress value={value} className="h-2" />
                <div className="text-xs mt-1">{value}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!showFeedback ? (
        <Card>
          <CardHeader>
            <CardTitle>{situation.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{situation.description}</p>
            <div className="space-y-2">
              {situation.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleChoice(option)}
                  variant="outline"
                  className="w-full text-left justify-start h-auto py-4"
                >
                  {option.text}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {feedback.levelUp ? "Повышение уровня! 🎉" : "Результат"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{feedback.text}</p>
            <div className="space-y-2 mb-4">
              {Object.entries(feedback.impacts).map(([comp, value]) => (
                <div key={comp} className="flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  <span>
                    {COMPETENCIES[comp].name}: +{value}
                  </span>
                </div>
              ))}
            </div>

            {feedback.levelUp && (
              <Alert className="mb-4">
                <AlertTitle>Поздравляем!</AlertTitle>
                <AlertDescription>
                  Вы достигли уровня {level}: {CAREER_LEVELS[level]}
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={handleNextSituation} className="w-full">
              Продолжить
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CareerGame;
