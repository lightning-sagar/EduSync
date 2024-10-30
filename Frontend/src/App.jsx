import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Home from './pages/Home/Home';
import Features from './pages/Features/Features';
import About from './pages/About/About';
import Profile from './pages/Profile/Profile';
import Class from './components/Class/Class';
import Chatbot from './components/ChatBot/Chatbot';
import Ebook from './components/Ebook/Ebook';
import JoinSubject from './components/JoinSubject/JoinSubject'; 
import Stream from './components/stream/Stream';
import CompWhiteBoard from './components/WhiteBoard/CompWhiteBoard.jsx';
import Info from './components/Info/Info';
import Chat from './components/Chat/Chat';
import Dashboard from './pages/Dashboard/Dashboard.jsx';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
 
  return (
    <Router>
      <>
        <Navbar setShowLogin={setShowLogin} />
        {showLogin && <Login setShowLogin={setShowLogin} />}
    
        <Routes>
          <Route path="/" element={<><Home /><Chatbot /></>} />
          <Route path="/features" element={<><Features /><Chatbot /></>} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/subject/:id" element={<><Class /></>} />
          <Route path="/join/:id" element={<JoinSubject />} /> 
          <Route path='/:sId/stream/:callId' element={<Stream />} />
          <Route path='/whiteboard/:subjectId' element={<CompWhiteBoard />} />
          <Route path="/info/:id" element={<Info />} />  
          <Route path="/chat/:id" element={<><Chat /></>} />
          <Route path="/Dashboard" element={<><Dashboard /></>} />
        </Routes>
      </> 
    </Router>
  );
};

export default App;
