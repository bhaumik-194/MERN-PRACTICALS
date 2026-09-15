import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h2>Home</h2>
      <button><Link to="/about">About</Link></button>
      <button><Link to="/contact">Contact</Link></button>
    </div>
  )
}

export default Home