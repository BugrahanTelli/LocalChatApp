import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import Users from './Components/Users';
import PeopleTalked from './Components/PeopleTalked';

const socket = io('http://localhost:3001');

function App() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isChatActive, setIsChatActive] = useState(false);
  const [talkedPeople, setTalkedPeople] = useState([]);
  const messagesEndRef = useRef(null);
  const isUserScrolling = useRef(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false); 

  useEffect(() => {
    console.log("Component mounted");

    socket.on('receive_message', (data) => {
      console.log("Received message:", data); 
      setMessages((prev) => [...prev, data]);
      if (!talkedPeople.includes(data.username)) {
        setTalkedPeople((prev) => [...prev, data.username]);
      }
    });

    return () => {
      console.log("Cleaning up socket listener");
      socket.off('receive_message');
    };
  }, [talkedPeople]);

  useEffect(() => {
    if (!isUserScrolling.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleScroll = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    isUserScrolling.current = scrollHeight - scrollTop !== clientHeight;
  };

  const sendMessage = (e) => {
    e.preventDefault(); 
    if (isSendingMessage) {
      console.log("Message is already being sent, ignoring this call.");
      return; 
    }
    setIsSendingMessage(true); 

    console.log("Sending message:", currentMessage); 
    if (currentMessage.trim()) {
      const messageData = {
        username: username || 'Anonim',
        text: currentMessage,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);
      if (!talkedPeople.includes(messageData.username)) {
        setTalkedPeople((prev) => [...prev, messageData.username]);
      }
      setCurrentMessage('');
    } else {
      alert("Message cannot be empty!");
    }

    setIsSendingMessage(false); 
  };

  const handleLogin = (name) => {
    setUsername(name);
    setIsChatActive(true);
  };

  return (
    <div className="App">
      <PeopleTalked talkedPeople={talkedPeople} currentUser ={username} />
      <div className="container">
        {!isChatActive ? (
          <Users onLogin={handleLogin} />
        ) : (
          <div>
            <div className="messages" onScroll={handleScroll}>
              {messages.map((msg, index) => (
                <div key={index} className={`bubble ${msg.username === username ? 'b1' : 'b2'}`}>
                  <span className="message">
                    <strong>{msg.username}</strong>: {msg.text }
                    <br />
                    <small>{msg.time}</small>
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="typewriter">
              <input
                type="text"
                className="wrote"
                placeholder="Bir mesaj yazın..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
              />
              <button className="send" type="submit">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;