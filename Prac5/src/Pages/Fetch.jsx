import React, { useState, useEffect } from "react";

const Fetch = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
    .then((response)=>response.json())
    .then((data)=>setUsers(data));
  }, []);

  return (
    <div>
      <h2>Data Coming from Fetch</h2>
      <h3>Users</h3>
      {users.map((user)=>(
        <div key={user.id}>
            <h4>{user.name}</h4>
            <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default Fetch;
