import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div>
      <h2>About</h2>
      <button><Link to="/">Home</Link></button>
      <button><Link to="/contact">Contact</Link></button>
    </div>
  )
}

export default About