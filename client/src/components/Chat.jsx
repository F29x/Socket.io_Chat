import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import ScrolltoBottom from 'react-scroll-to-bottom';

function Chat({ socket, username, room }) {
  const [text, setText] = useState("");
  const [messagelist, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (text !== "") {
      const message = {
        room,
        author: username,
        currentMessage: text,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", message);
      setMessageList((list) => [...list, message]);
      setText("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    socket.off("receive_message").on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrolltoBottom className="scroll">
          {messagelist.map((messageContent, index) => {
            return (
              <div className="message" key={index} id={username === messageContent.author ? "you" : "other"}>
                <div>
                  <div>
                    <p>{messageContent.currentMessage}</p>
                  </div>
                  <div className="message-meta">
                    <p>{messageContent.author}</p>
                    <p>{messageContent.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrolltoBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={text}
          placeholder="write a message"
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

Chat.propTypes = {
  socket: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
};

export default Chat;
