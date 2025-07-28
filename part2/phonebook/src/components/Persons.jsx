const Persons = (props) => {
  return (
    <table><tbody>
      {props.persons.map(
        (person,i) => <tr key={i}>
          <td>{person.name}</td>
          <td>{person.number}</td>
        </tr>
      )}
    </tbody></table>
  )
}

export default Persons
