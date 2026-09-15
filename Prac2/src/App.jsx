import React from "react";
import Card from "./components/Card";
import { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(1);
  return (
    <div>
      <h1>Student Information</h1>
      <Card no={1} name="Bhaumik" age={21} major="Computer Science"/>
      <Card no={2} name="Shaurya" age={20} major="Information Technology"/>
      <Card no={3} name="Akshar" age={22} major="Cyber Security"/>
      <p>Count : {count}</p>
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </div>
  );
};

export default App;
