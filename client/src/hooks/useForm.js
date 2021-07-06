import { useEffect, useState } from "react";

export default function useForm(initial = {}) {
  const [inputs, setInputs] = useState(initial);
  const initialValue = Object.values(initial).join('');
  
  useEffect(() => {
    setInputs(initial)
  }, [initialValue])

  function handleChange(e) {
    let {value, name, type} = e.target
    if(type === 'number') {
      value = parseInt(value)
    }
    if(type === 'file') {
      [value] = e.target.files
    }
    setInputs({ 
      ...inputs,
      [name]: value
    })
  }
  
  
  return {
    inputs,
    handleChange,
  }
}