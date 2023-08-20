/* eslint-disable no-unused-vars */
import {useState} from 'react'
import './App.css';
import io from 'socket.io-client';
import Chat from './Chat';

const socket = io.connect("http://localhost:4500")

function App() {

  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinRoom = ()=>{
    if(username !== "" && room !== "" ){
      socket.emit('join_room', room)
      setShowChat(true)
    }
  }

  return (
    <div className="App container m-5">
      {!showChat ? (
      <div>
        <h1>Join a Chat</h1>
        <div className='container px-5'>
          <input className='form-control my-2' type="text" placeholder='John...' onChange={(event)=> setUsername(event.target.value)} />
          <input className='form-control my-2' type="text" placeholder='Room ID...' onChange={(event)=> setRoom(event.target.value)} />
          <button onClick={joinRoom} disabled={
            username === "" ||
            room === ""
           } className='btn btn-primary'>Join a room</button>
        </div>
      </div>
      ) : (
      <Chat room={room} socket={socket} username={username} />
      )}
    </div>
  );
}

export default App;
