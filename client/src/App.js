import logo from './logo.svg';
import './App.css';
import {io} from 'socket.io-client';
import TextField from '@material-ui/core/TextField'
import {Input, Container} from 'theme-ui'
import { Button, Heading } from 'theme-ui'
import {useEffect, useState} from 'react'
import { v4 as uuidv4 } from 'uuid';

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

/**
 * Handles rendering a single message
 * 
 * @param {Object} msgObj – object of format { message: '', nickname: '' } 
 */
const Message = ({msgObj}) => {
  return (
    <div>
      {`${msgObj.nickname}: ${msgObj.message}`}
    </div>
  )
}

export const App = () => {
  const [id, setId] = useState('');
  const [nickname, setNickname] = useState('');
  const [privateMsg, setPrivateMsg] = useState('');
  const [publicMsg, setPublicMsg] = useState('');
  const [socket] = useSocket(REACT_APP_SERVER_URL);
  const [messages, setMessages] = useState([])

  // const [socket, setSocket] = useState(io(REACT_APP_SERVER_URL));

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log(`Connected; socket ID: ${socket.id}`); // 'G5p5...'
    });

    socket.on('chat message', (msgObj) => {
      setMessages(prevMessages => [...prevMessages, msgObj])
    })
  }, [])
 
  const sendMessage = (chatType) => {
    const msgToSend = chatType === "privateChat" ? privateMsg : publicMsg;
    socket.emit('chat message', { message: msgToSend, nickname: nickname } )
  }

  const MessagesList = () => {
    return messages.map(msg => (<Message key={uuidv4()} msgObj={msg} />))
  }
  
  return (
    <div className="container">
      <div className="header chatInput" style={{marginTop: "15px", justifyContent: "space-evenly", height: "auto"}}>
        <Heading>Private</Heading>
        <Input style={{width: "20%"}} onChange={(e) => {setNickname(e.target.value)}} placeholder="Enter nickname"/>
        <Heading>Public</Heading>
      </div>
      <div className="chats">
        <Container p={4} bg='muted' sx={{ mt: '10px'}} id="messagesBox">
          <MessagesList />
        </Container>

        <ChatInput chatType="privateChat" inputType="privateInput" changeHandler={setPrivateMsg} clickHandler={sendMessage}/>
        <ChatInput chatType="allChat" inputType="allInput" clickHandler={sendMessage} changeHandler={setPublicMsg} />
      </div>
    </div>
  )
}
