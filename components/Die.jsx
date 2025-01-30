export function Die ({value, isHeld, isWrong, id, check}){
  const onHold = isHeld === true? "held-button" : undefined
  const Wrong = isWrong === true? "wrong" : undefined

  return (
    <button className={onHold + " " + Wrong} onClick={()=>{
      check(value, id)      
    }      
    }>{value}</button>
  )
}