import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();

  const name: string = localStorage.getItem("name") || "Guest";
  const mbkId: string = localStorage.getItem("mbkId") || "Not Set";
  const userRole: string = localStorage.getItem("userRole") || "Guest";

  const handleLogout = (): void => {
     if (window.confirm("Are you sure you want to logout?")) {
      // Handle logout logic here
      alert("Logged out successfully!")
    }
    localStorage.clear();
    //navigate('/login');
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>MBKID:</strong> {mbkId}</p>
    <p><strong>User Role:</strong> {userRole}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserProfile;
