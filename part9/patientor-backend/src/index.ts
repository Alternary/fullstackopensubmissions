import express from 'express';
import cors from 'cors';
import { Patient, Gender, Diagnosis, NonSensitivePatient } from '../src/types';

import { z } from 'zod';

import { v1 as uuid } from 'uuid';

const app = express();
app.use(express.json());
app.use(cors());

import diagnoses from '../data/diagnoses';
import patients from '../data/patients-full';

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

app.get('/api/diagnoses', (_req,res) => {
  const ds = getDiagnoses();
  res.send(ds);
});

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
     
    id,
     
    name,
     
    dateOfBirth,
     
    gender,
     
    occupation,
  }));
};

app.get('/api/patients', (_req,res) => {
  const ps = getPatients();
  res.send(ps);
});

app.get('/api/patients/:id', (req,res) => {
  const ps = patients
    .map(({ id, name, dateOfBirth, ssn, gender, occupation, entries }) => ({
       
      id,
       
      name,
       
      dateOfBirth,
       
      ssn,
       
      gender,
       
      occupation,
      entries
    }))
    .filter(p => p.id === req.params.id);
  res.send(ps);
});

const toNewPatient = (object : unknown) : Patient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }
  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    const newPatient = {
      id: uuid(),
      name: z.string().parse(object.name),
      dateOfBirth: z.string().date().parse(object.dateOfBirth),
      ssn: z.string().parse(object.ssn),
      gender: z.enum(Gender).parse(object.gender),
      occupation: z.string().parse(object.occupation),
      entries: []
    };
    return newPatient;
  }

  throw new Error('Incorrect data: some fields are missing');
};

app.post('/api/patients', (req,res) => {
  const newPatient = toNewPatient(req.body);
  res.send(newPatient);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
