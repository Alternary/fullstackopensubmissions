function calculateBmi(height: number, weight: number): string {
  if (height === 0) {
    return 'division by zero';
  }
  const bmi = weight/(height/100)**2;
  if (bmi < 16) {
    return 'Underweight (Severe thinness)';
  }
  if (bmi < 17) {
    return 'Underweight (Moderate thinness)';
  }
  if (bmi < 18.5) {
    return 'Underweight (Mild thinness)';
  }
  if (bmi < 25) {
    return 'Normal range';
  }
  if (bmi < 30) {
    return 'Overweight (Pre-obese)';
  }
  if (bmi < 35) {
    return 'Obese (Class I)';
  }
  if (bmi < 40) {
    return 'Obese (Class II)';
  }
  if (bmi >= 40) {
    return 'Obese (Class III)';
  }
  return "other bmi";
}
if (require.main === module) {
  console.log(calculateBmi(180, 74));
  // console.log(calculateBmi(180, 50));
  const argumentList = process.argv;
  if (argumentList.length > 2) {
    if (argumentList.length !== 4) {
      throw new Error('wrong number of arguments');
    };
    const arg1 = Number(argumentList[2]);
    const arg2 = Number(argumentList[3]);
    if (isNaN(arg1) || isNaN(arg2)) {
      throw new Error('A provided value was not number');
    };
    console.log(calculateBmi(arg1,arg2));
  }
}

export default calculateBmi;
