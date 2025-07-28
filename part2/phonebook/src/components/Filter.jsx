const Filter = (props) => {
  return (
    <div>
      filter shown with
      <input
        value={props.search}
        onChange={props.onSearchChange}
      />
    </div>
  )
}

export default Filter
