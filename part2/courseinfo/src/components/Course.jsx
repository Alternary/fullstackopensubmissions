const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => {
  return (
    <div>
      {props.parts.map(
        part => <Part key={part.name} part={part} />
      )}
    </div>
  )
}

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <p>total of {props.total} exercises</p>

const Course = ({course}) => {
//  console.log(course.parts[0].exercises+0)
  const total = course.parts.reduce(
      (sum, x) => sum+x.exercises
    ,0)
//  console.log(total)
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        total={total}
      />
    </div>
  )
}

export default Course
