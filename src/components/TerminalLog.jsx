// InputType -> userString, userStringLength, stringIdx
// displayType -> Error, Warning, Infromation

const TerminalLog = ({inputType, input, displayType, display }) => {
  let prev = ""
  switch (inputType) {
    case "consent":
      prev = "Enter (Y/N): "
      break
    case "userString":
      prev = "String: "
      break
    case "userStringLength":
      prev = "Length: "
      break
    case "stringIdx":
      prev = "String Index: "
      break
    default:
      break
  }

  return <li>
    <p className="input">
      <span className="prev">{prev}</span>
      <span className="input">{input}</span>
    </p>
    {(display || displayType) ? <p className={displayType}>
      {display}
    </p> : <></>}
  </li>
}

export default TerminalLog