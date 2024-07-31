import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './components/Chat';

const socket = io("http://localhost:3000");


function App() {
  const [username,setUserName]= useState("");
  const [room,setRoom]= useState("");
  const [showchat,setShowChat] = useState(false)

  const joinRoom=()=>{
    if(username !== "" && room !==""){
       socket.emit("join_room",room)
       setShowChat(true)
       
    }
  }
 

  return (
    
    <>
    <div className='main-div'>
      {!showchat ? (
        <>
          <h3>Join Chat</h3>
          <input
            type="text"
            placeholder='username'
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder='room'
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
          <button onClick={joinRoom}>Join Room</button>
        </>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  </>
  
      
  
  )
}

export default App
