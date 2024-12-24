import { useEffect, useRef, useState } from "react"
import TerminalLog from "./TerminalLog"
import "../styles/terminal.css"
// Terminal
// Input

// Logs
// Type
// Input
// Reply

const Terminal = () => {
  const [logs, setLogs] = useState([])
  const [inputType, setInputType] = useState("consent")
  const [userString, setUserString] = useState(null)
  const [userStringLength, setUserStringLength] = useState(null)
  const [input, setInput] = useState("")
  const [prev, setPrev] = useState("")
  const inputRef = useRef()
  const inputTypeRef = useRef()
  const stringRef = useRef()
  const stringLengthRef = useRef()

  const focusOnInput = () => {
    if(inputRef.current){
      inputRef.current.focus()
    }
  }

  const validateInput = (inputType, input) => {
    switch(inputType){
      case "consent":
        if(input === "N" || input === "n"){
          window.location.href = "https://www.google.com/search?q=cute+cats&udm=2"
          return false
        }
        return true
      case "userString":
        if(input.length === 0){
          return "Looks like you forgot your string, I can't read your mind you know"
        }
        return true
      case "userStringLength":
      case "stringIdx":
        if(input.length === 0){
          return "Looks like you forgot your integer, I can't read your mind you know"
        }
        if(isNaN(input) || Number(input) !== parseInt(input)){
          return "I'll need an integer for this magic trick, stay with me now"
        }
        return true
      default:
        return true
    }
  }

  const getChar = async (string, length, idx) => {
    const result = {}
    try{
      const response = await fetch('/api/check-flag', { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "str": string, "idx": idx, "length": length })
      })

      if(response.ok)result["status"] = "success"
      else result["status"] = "error"

      const data = await response.json()
      result["response"] = data?.response
    }catch{
      result["status"] = "error"
    }
    return result
  }

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      const currentInputType = inputTypeRef.current, currentInput = inputRef.current.value
      if(currentInput.toLowerCase() === "clear"){
        setInput("")
        setInputType("userString")
        setUserString(null)
        setUserStringLength(null)
        if(currentInputType === "consent")return
        setLogs([
          {
            "inputType": "consent",
            "input": "Y"
          }
        ])
        return
      }
      const validation = validateInput(currentInputType, currentInput)
      setInput("")
      if(validation !== true){
        if(currentInputType === "consent")return
        setLogs(prevLogs => {
          const logCopy = [...prevLogs]
          logCopy.push({
            input: currentInput,
            inputType: currentInputType,
            display: validation,
            displayType: "error"
          })
          return logCopy
        })
        return
      }
      switch(currentInputType){
        case "consent":
          setInputType("userString")
          setLogs(prevLogs => {
            const logCopy = [...prevLogs]
            logCopy.push({
              input: currentInput,
              inputType: currentInputType
            })
            if(currentInput !== "Y"){
              logCopy.at(-1)["display"] = "...I'll take that" // Maybe a smirk here?
              logCopy.at(-1)["displayType"] = "info" // Maybe a smirk here?
            }
            return logCopy
          })
          break
        case "userString":
          setUserString(currentInput)
          setInputType("userStringLength")
          setLogs(prevLogs => {
            const logCopy = [...prevLogs]
            logCopy.push({
              input: currentInput,
              inputType: currentInputType
            })
            return logCopy
          })
          break
        case "userStringLength":
          setUserStringLength(parseInt(currentInput))
          setInputType("stringIdx")
          setLogs(prevLogs => {
            const logCopy = [...prevLogs]
            logCopy.push({
              input: currentInput,
              inputType: currentInputType,
              display: "Now for my next trick, I'll tell you the character at any index!",
              displayType: "info"
            })
            return logCopy
          })
          break
        case "stringIdx": // API call here

          const result = await getChar(stringRef.current, stringLengthRef.current, parseInt(currentInput) )
          setLogs(prevLogs => {
            const logCopy = [...prevLogs]
            logCopy.push({
              input: currentInput,
              inputType: currentInputType,
              display: result["response"],
              displayType: result["status"] === "error" ? "error" : undefined
            })
            return logCopy
          })
          break
        default:
          break

      }
      // Do something when Enter is pressed
    }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
  }

  const handleWebsiteBlur = () => {
    const label = document.querySelector("label[for='user-input']")
    label.classList.add("blur")
  }

  const handleWebsiteFocus = () => {
    const label = document.querySelector("label[for='user-input']")
    focusOnInput()
    label.classList.remove("blur")
  }

  const scrollDown = () => {
    const objDiv = document.querySelector(".user-interact")
    if(objDiv){
      objDiv.scrollTop = objDiv.scrollHeight
    }
  }

  useEffect(() => {
    focusOnInput()

    const parsedLogs = JSON.parse(localStorage.getItem("logs") || "[]")
    if(parsedLogs.length){
      let userString = null, userStringLength = null
      for(const {input, inputType, display, displayType} of parsedLogs){
        if(displayType !== "error" && validateInput(inputType, input) === true){
          if(inputType === "userString")userString = input
          else if(inputType === "userStringLength" && userString !== null)userStringLength = parseInt(input)
        }
      }

      if(userString === null)setInputType("userString")
      else if(userStringLength === null)setInputType("userStringLength")
      else setInputType("stringIdx")

      setUserString(userString)
      setUserStringLength(userStringLength)
      setLogs(parsedLogs)
    }else{
      setInputType("consent")
    }
    const terminal = document.querySelector("div.user-interact")
    terminal.addEventListener("click", focusOnInput)
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("blur", handleWebsiteBlur)
    window.addEventListener("focus", handleWebsiteFocus)
    return () => {
      terminal.removeEventListener("click", focusOnInput)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("blur", handleWebsiteBlur)
      window.removeEventListener("focus", handleWebsiteFocus)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs))
    scrollDown()
  }, [logs])
  
  useEffect(() => {
    inputTypeRef.current = inputType
    switch (inputType) {
      case "consent":
        setPrev("Enter (Y/N): ")
        break
      case "userString":
        setPrev("String: ")
        break
      case "userStringLength":
        setPrev("Length: ")
        break
      case "stringIdx":
        setPrev("String Index: ")
        break
      default:
        break
    }
  }, [inputType])

  useEffect(() => {
    stringRef.current = userString
  }, [userString])

  useEffect(() => {
    stringLengthRef.current = userStringLength
  }, [userStringLength])
  return (
    <>
      <ul id="logs">
        {logs.map((log, idx) => <TerminalLog {...log} key={idx}/> )}
      </ul>
      <label htmlFor="user-input">
        <span id="prev">{prev}</span>
        <span id="cursor-wrapper">
          <input
            type="text"
            id="user-input"
            name="user-input"
            ref={inputRef}
            value={input}
            onInput={handleInput}
            onLoad={focusOnInput}
            autoComplete="off"
          />
          <span id="cursor">{input}</span>
        </span>
      </label>
    </>
  )
}

export default Terminal