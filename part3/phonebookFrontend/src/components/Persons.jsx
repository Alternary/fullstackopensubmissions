const Persons = (props) => {
  return (
    <table><tbody>
      {props.persons.map(
        (person,i) =>
          <tr key={i}>
            <td>{person.name}</td>
            <td>{person.number}</td>
            <td>
              <button
                onClick={() => props.deletePerson(person.id)}
              >delete person</button>
            </td>
          </tr>
      )}
    </tbody></table>
  )
}

export default Persons
