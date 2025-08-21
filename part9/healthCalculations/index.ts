// const express = require('express');
import express from 'express';
const app = express();
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const weight = Number(req.query.weight);
  const height = Number(req.query.height);
  if (!weight || !height || isNaN (weight+height)) {
    res.status(400).send({ error: 'malformatted parameters' });
  };
  // console.log(weight, height);
  const bmiInfo = {
    weight: weight,
    height: height,
    bmi: calculateBmi(height, weight)
  };
  res.send(bmiInfo);
});

app.post('/exercises', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises_val, target_val } = req.body;

    // if (!Array.isArray(daily_exercises_val)) {
    //   return res.status(400).send({ error: 'malformatted values' });
    // }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const daily_exercises = daily_exercises_val.map((x: unknown) => Number(x));
    const target = Number(target_val);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (!daily_exercises || !target || [...daily_exercises, target].includes(NaN)) {
      return res.status(400).send({ error: 'malformatted values' });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = calculateExercises(daily_exercises, target);
    return res.send({ result });
  } catch {
    return res.status(400).send({ error: 'parameters missing or invalid' });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
