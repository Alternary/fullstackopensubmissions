import express from 'express';
import cors from 'cors';

import { z } from 'zod';

import { v1 as uuid } from 'uuid';

const app = express();
app.use(express.json());
app.use(cors());

import diagnoses from '../data/diagnoses';
import patients from '../data/patients';

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

app.get('/api/diagnoses', (_req,res) => {
  const ds = getDiagnoses();
  res.send(ds);
});

interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
}

const getPatients = (): Omit<Patient, 'ssn'>[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation}) => ({
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

// const isString = (text: unknown): text is string => {
//   return typeof text === 'string' || text instanceof String;
// };

// const parseName = (name: unknown): string => {
//   // if (!isString(name)) {
//   //   throw new Error('Incorrect or missing name');
//   // }
//   // return name;
//   return z.string().parse(name);
// };

// const isDate = (date: string): boolean => {
//   return Boolean(Date.parse(date));
// };
//
// const parseDateOfBirth = (dateOfBirth: unknown): string => {
//   if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
//       throw new Error('Incorrect or missing date: ' + dateOfBirth);
//   }
//   return dateOfBirth;
// };

// const parseSsn = (ssn: unknown): string => {
//   if (!isString(ssn)) {
//     throw new Error('Incorrect or missing ssn: ' + ssn);
//   }
//   return ssn;
// };

enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

// const isGender = (param: string): param is Gender => {
//   return Object.values(Gender).map(v => v.toString()).includes(param);
// };
//
// const parseGender = (gender: unknown): string => {
//   if (!isString(gender) || !isGender(gender)) {
//     throw new Error('Incorrect or missing gender: ' + gender);
//   }
//   return gender;
// };

// const parseOccupation = (occupation: unknown): string => {
//   if (!isString(occupation)) {
//     throw new Error('Incorrect or missing occupation: ' + occupation);
//   }
//   return occupation;
// };

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
      occupation: z.string().parse(object.occupation)
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
