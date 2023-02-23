import { BrowserRouter, Route, Routes, redirect } from "react-router-dom";
import Header from "./components/Header/Header";
import Landing from './pages/Landing/Landing'
import ScrollToTop from './ScrollToTop';
import UpcomingAppointments from "./components/MyAppointments/UpcomingAppointments";
import { useEffect } from "react";
import { connectMQTT } from "./Infrastructure/PMQTTController";
import Login from "./pages/Authentication/Login";
import Dentistries from "./pages/Dentistries/Dentistries";
import { SignUp } from "./pages/Authentication/SignUp";
import { useState } from 'react';
import ErrorBoundary from "./pages/ErrorPages/ErrorBoundary";

const token = localStorage.getItem('TOKEN');

const App = () => {

  const [getError, setGetError] = useState('')

  useEffect(() => {
    try {
      connectMQTT();
    } catch (e) {
      console.log('MQTT cannot connect. Please try again.');
    }
  }, []);

  return (
    <BrowserRouter>
      <Header/>
      <ScrollToTop/>
      <div style={{ marginTop: '120px' }}>
      <ErrorBoundary>
        <Routes>
          <Route path="/appointments" element={<Dentistries />}></Route>
          { (token == 'null' || token == undefined) ? 
          <>
            <Route path="/" element={<Login pageName='Login'/>}></Route>
            <Route path="/signup" element={<SignUp/>}></Route>
          </> 
          : 
          <>
            <Route path="/appointments" element={<Landing pageName={'Home'}/>}></Route>
            <Route path="/" element={<Landing pageName={'Home'}/>}></Route>
            <Route path="/myslots" element={<UpcomingAppointments/>}></Route>
            <Route path="/signOut" />
          </> 
          }
          </Routes>
          </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
};

export default App;