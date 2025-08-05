import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [name, setName] = useState('');
  const [mbkId, setMbkId] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (name && mbkId) {
      localStorage.setItem('name', name);
      localStorage.setItem('mbkId', mbkId);
      navigate('/profile');
    } else {
      alert('Please fill in both fields');
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: "1rem", display: "block" }}
      />
      <input
        type="text"
        placeholder="Enter MBKID"
        value={mbkId}
        onChange={(e) => setMbkId(e.target.value)}
        style={{ marginBottom: "1rem", display: "block" }}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;

