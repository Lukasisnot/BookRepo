import React from 'react';
import { Card, Button } from 'flowbite-react';
import API from '../api'; 
import { useNavigate } from 'react-router-dom';
import AdminPage from '../pages/AdminPage/AdminPage';
import Navbar from '../components/NavBar';


function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.get('/user/logout');
      localStorage.removeItem('isUserLoggedIn');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
     
    <Card className="max-w-md mx-auto mt-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard!</h1>
      <p className="mb-6">This is a protected area, only accessible if you are logged in.</p>
      <Button color="failure" onClick={handleLogout}>
        Logout
      </Button>
    </Card>
  );
}

export default Dashboard;