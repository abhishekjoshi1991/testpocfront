
import Base from "../components/Base";
import React, { useEffect } from 'react';
import './Home.css';
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../auth";

const Home = (args) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/user-routes/dashboard'); 
    }else{
      navigate("/login")
    }
  }, [navigate]);

  return (
    <Base>

    </Base>
  );
};

export default Home;
