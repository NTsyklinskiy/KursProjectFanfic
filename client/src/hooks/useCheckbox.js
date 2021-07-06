import { useEffect, useState } from "react";

export default function useCheckbox(initial = []) {

const [checkeds, setChecked] = useState({})
  
  useEffect(() => {
    setChecked(() => {
      return Object.assign({},...initial.map((user, i)=> {
        return {
           [user.id]:  false
          
        }
      })
    )})
  }, [initial])

  function handleChange(e) {
    let {name, checked} = e.target;
    
    setChecked({
      ...checkeds,[name]: checked
    })
  }

  function handler(boolean){
    const change = Object.fromEntries(Object.entries(checkeds).map(([key, value]) => [key, boolean]))
    setChecked(change) 
  }
  function handleChangeAll(){
    handler(true)
  }

  function handleChangeNo(){
    handler(false)
  }
  return {
    checkeds,
    handleChange,
    handleChangeAll,
    handleChangeNo
  }
}
