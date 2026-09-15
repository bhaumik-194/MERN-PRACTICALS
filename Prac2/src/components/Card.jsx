import React from 'react'

const Card = (props) => {
  return (
    <div>
        <p><strong>No: {props.no}</strong></p>
        <p>Name: {props.name}</p>
        <p>Age: {props.age}</p>
        <p>Major: {props.major}</p>
    </div>
  )
}

export default Card