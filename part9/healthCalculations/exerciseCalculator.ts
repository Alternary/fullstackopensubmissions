interface exerciseInterface {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

function calculateExercises(dailyExerciseHours: number[], target: number): exerciseInterface {
  const averageHours = dailyExerciseHours.reduce((el, sum) => sum+el)/(dailyExerciseHours.length);
  const rating =
    averageHours < 0.5*target
    ? 1
    : averageHours < 1.5*target
      ? 2
      : 3;
  const ratingDescription =
    rating === 1
    ? 'bad'
    : rating === 2
      ? 'not too bad but could be better'
      : 'good';
  return {
    periodLength: dailyExerciseHours.length,
    trainingDays: dailyExerciseHours.filter(hours => hours !== 0).length,
    success: averageHours >= target,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: averageHours
  };
};
if (require.main === module) {
  console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
  const argumentList = process.argv;
  if (argumentList.length > 2) {
    if (argumentList.length === 3) {
      throw new Error('amount of arguments may not be one');
    }
    const target = Number(argumentList[2]);
    const exerciseHours =
      argumentList.splice(3)
      .map(s => Number(s));
    const includesNaN = [target,...exerciseHours].includes(NaN);
    if (includesNaN) {
      throw new Error('an argument was not number');
    }
    console.log(calculateExercises(exerciseHours, target));
  }
}

export default calculateExercises;
