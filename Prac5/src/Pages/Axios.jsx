import React, { useState, useEffect } from "react";
import axios from "axios";

const Axios = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users")
    .then((response)=>{
      setUsers(response.data);
    })
  }, []);

  return (
    <div>
      <h2>Data Coming from Axios</h2>
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

export default Axios;
