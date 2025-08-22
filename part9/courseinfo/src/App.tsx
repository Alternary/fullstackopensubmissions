interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic";
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group"
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background"
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
  {
    name: "Backend development",
    exerciseCount: 21,
    description: "Typing the backend",
    requirements: ["nodejs", "jest"],
    kind: "special"
  }
];

const App = () => {
  const courseName = "Half Stack application development";
  // const courseParts = [
  //   {
  //     name: "Fundamentals",
  //     exerciseCount: 10
  //   },
  //   {
  //     name: "Using props to pass data",
  //     exerciseCount: 7
  //   },
  //   {
  //     name: "Deeper type usage",
  //     exerciseCount: 14
  //   }
  // ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

const Header = ({ name }: { name: string }) => {
  return <h1>{name}</h1>
}
// Array.prototype.intersperse = function(sep) {
//   return this.flatMap((el, i) => i == 0 ? [el] : [sep, el]);
// }
const Part = ({ coursePart }: { coursePart: CoursePart }) => {
  let additionalInformation = <></>
  switch(coursePart.kind) {
    case 'basic':
      additionalInformation = <p><i>{coursePart.description}</i></p>
      break;
    case 'group':
      additionalInformation = <p>project exercises {coursePart.groupProjectCount}</p>
      break;
    case 'background':
      additionalInformation = (
        <p>
          <i>{coursePart.description}</i>
          <br></br>
          submit to {coursePart.backgroundMaterial}
        </p>
      )
      break;
    case 'special':
      additionalInformation = (
        <p>
          <i>{coursePart.description}</i>
          <br></br>
          required skills: {coursePart.requirements[0]+coursePart.requirements.splice(1).map(r => ', '+r)}
        </p>
      )
  }
  return (
    <>
      <p>
        <b>
          {coursePart.name} {coursePart.exerciseCount}
        </b>
      </p>
      {additionalInformation}
    </>
  )
}

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <>
      {courseParts.map((cp,i) =>
        <Part key={i} coursePart={cp} />
      )}
    </>
  )
}

const Total = ({ totalExercises } : { totalExercises: number }) => {
  return <p>Number of exercises {totalExercises}</p>
}

export default App;
