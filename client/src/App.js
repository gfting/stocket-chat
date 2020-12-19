import logo from './logo.svg';
import './App.css';
import {io} from 'socket.io-client';
import TextField from '@material-ui/core/TextField'
import {Input} from 'theme-ui'
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

export const ChatInput = ({chatType, inputType}) => {
  return (
    <div id={inputType} className="chatInput">
      <Input 
      style={{width: "80%", marginRight: "10px"}}
      placeholder="Type message here..."
      />
      <Button>Send</Button>
    </div>
    
  )
}

export const App = () => {
  const [id, setId] = useState('');
  const [socket] = useSocket(REACT_APP_SERVER_URL);

  // const [socket, setSocket] = useState(io(REACT_APP_SERVER_URL));

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log(socket.id); // 'G5p5...'
    });

    socket.emit("hi", { name: "John" });
  }, [])

  const handleConnect = () => {

  }
  
  return (
    <div className="container">
      <div className="header chatInput" style={{marginTop: "15px", justifyContent: "space-evenly", height: "auto"}}>
        <Heading>Private</Heading>
        <Input style={{width: "20%"}} placeholder="Enter nickname"/>
        <Heading>Public</Heading>
      </div>
      <div className="chats">
        <ChatInput chatType="privateChat"
        inputType="privateInput" />
        <ChatInput chatType="allChat" inputType="allInput" />

      </div>
    </div>
  )
}
