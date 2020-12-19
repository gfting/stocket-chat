import logo from './logo.svg';
import './App.css';
import {io} from 'socket.io-client';
import TextField from '@material-ui/core/TextField'
import {Input, Box} from 'theme-ui'
import { Button, Heading } from 'theme-ui'
import {useEffect, useState} from 'react'

import useSocket from 'use-socket.io-client';

const {REACT_APP_SERVER_URL} = process.env

/**
 * // Grid proportions:
  // Header 10%
    - Set nickname
      - Inputbox that swaps to text until clicked
    - Application title? 
  // Body 90%
    - Split in half
    // Content 80%
    - Private on left, special styling for private chats
    - Allchat on right
    // Footer 20%
      - Send buttons, text buttons
 */

export const ChatInput = ({chatType, inputType, clickHandler, changeHandler}) => {
  return (
    <div id={inputType} className="chatInput">
      <Input 
      style={{width: "80%", marginRight: "10px"}}
      placeholder="Type message here..."
      onChange={(e) => {changeHandler(e.target.value)}}
      />
      <Button onClick={(e) => {clickHandler(chatType)}}>Send</Button>
    </div>
  )
}

const Message = ({msgObj}) => {
  console.log(msgObj.message)
  return (
    <div id={msgObj.message}>
      {msgObj.message}
    </div>
  )
}

export const App = () => {
  const [id, setId] = useState('');
  const [nickname, setNickname] = useState('');
  const [privateMsg, setPrivateMsg] = useState('');
  const [publicMsg, setPublicMsg] = useState('');
  const [socket] = useSocket(REACT_APP_SERVER_URL);
  const messages = []

  // const [socket, setSocket] = useState(io(REACT_APP_SERVER_URL));

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log(socket.id); // 'G5p5...'
    });

    socket.emit("hi", { name: "John" });
  }, [])

  useEffect(() => {
    
    socket.on('chat message', (msg) => {
      messages.push(msg)
    })
  })

  const sendMessage = (chatType) => {
    
    const msgToSend = privateMsg ? chatType === "privateChat" : publicMsg;
    socket.emit('chat message', { message: msgToSend, nickname: nickname } )
  }

  const MessagesList = () => (messages.map(msg => (<Message msgObj={msg} />)))
  
  return (
    <div className="container">
      <div className="header chatInput" style={{marginTop: "15px", justifyContent: "space-evenly", height: "auto"}}>
        <Heading>Private</Heading>
        <Input style={{width: "20%"}} onChange={(e) => {setNickname(e.target.value)}} placeholder="Enter nickname"/>
        <Heading>Public</Heading>
      </div>
      <div className="chats">
        <Box id="messagesBox">
          <MessagesList />
        </Box>

        <ChatInput chatType="privateChat" inputType="privateInput" changeHandler={setPrivateMsg} clickHandler={sendMessage}/>
        <ChatInput chatType="allChat" inputType="allInput" clickHandler={sendMessage} changeHandler={setPublicMsg} />
      </div>
    </div>
  )
}
