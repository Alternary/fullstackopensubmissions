import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

const baseUrl = '/api/diaries';

interface Diary {
  id: number,
  date: string,
  weather: string,
  visibility: string
}

const getAllDiaries = () => {
  return axios
    .get<Diary[]>(baseUrl)
    .then(response => response.data);
};

const createDiary = (object: Diary) => {
  return axios
    .post<Diary>(baseUrl, object)
    .then(response => response.data);
};

function App() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [date, setDate] = useState('2025-08-22');
  const [weather, setWeather] = useState('sunny');
  const [visibility, setVisibility] = useState('great');
  const [comment, setComment] = useState('');
  const [errorNotification, setErrorNotification] = useState('');

  useEffect(() => {
    void getAllDiaries().then(data => {
      setDiaries(data);
    });
  }, []);

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newDiary = {
      id: Math.max(...diaries.map(d => d.id))+1,
      date: date,
      weather: weather,
      visibility: visibility,
      comment: ''
    };
    setWeather('');
    setVisibility('');
    setComment('');
    setDate('');
    void createDiary(newDiary).then(data => {
      setDiaries(diaries.concat(data));
    }).catch(e => {
      const error = e as AxiosError;
      const errorMessage = error.response && error.response.data
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        ? String(error.response.data)
        : 'An unknown error occurred';
      setErrorNotification(errorMessage);
      setTimeout(() => {setErrorNotification('');},3000);
    });
  };

  return (
    <div>
      <p style={{color: "red"}}>{errorNotification}</p>
      <form onSubmit={addDiary}>
        <label htmlFor="date">date</label>
        <input
          type="date"
          id="date"
          value={date}
          name="date"
          onChange={(event) => setDate(event.target.value)}
        />
        <br></br>
        great
        <input type="radio" name="visibility" value="great" onChange={(event) => setVisibility(event.target.value)} />
        good
        <input type="radio" name="visibility" value="good" onChange={(event) => setVisibility(event.target.value)} />
        ok
        <input type="radio" name="visibility" value="ok" onChange={(event) => setVisibility(event.target.value)} />
        poor
        <input type="radio" name="visibility" value="poor" onChange={(event) => setVisibility(event.target.value)} />
        <br></br>
        sunny
        <input type="radio" name="weather" value="sunny" onChange={(event) => setWeather(event.target.value)} />
        rainy
        <input type="radio" name="weather" value="rainy" onChange={(event) => setWeather(event.target.value)} />
        cloudy
        <input type="radio" name="weather" value="cloudy" onChange={(event) => setWeather(event.target.value)} />
        stormy
        <input type="radio" name="weather" value="stormy" onChange={(event) => setWeather(event.target.value)} />
        windy
        <input type="radio" name="weather" value="windy" onChange={(event) => setWeather(event.target.value)} />
        <div>
          comment
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <button type='submit'>add</button>
      </form>
      {diaries.map((d,i) =>
        <p key={i}>
          id {d.id}
          <br></br>{d.date}
          <br></br>{d.weather}
          <br></br>{d.visibility}
        </p>
      )}
    </div>
  );
}

export default App;
