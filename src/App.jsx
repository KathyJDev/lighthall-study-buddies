import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import ChatroomList from './components/ChatroomList/ChatroomList.jsx';
import Chatroom from './components/Chatroom/Chatroom.jsx';
import Community from './components/Community/Community.jsx'
import './App.css'

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/:id" element={<ChatroomList />} />
          <Route path="/chatroom/:id/:chatroomId" element={<Chatroom />} />
          <Route path="/community/:id" element={<Community />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
