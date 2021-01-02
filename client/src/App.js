import logo from './logo.svg';
import './App.css';
import {io} from 'socket.io-client';
import TextField from '@material-ui/core/TextField'
import { Input, Container, Button, Heading, Text } from 'theme-ui'
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
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          clickHandler(chatType)
        }}
      }
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
      <Text
        sx={{
          fontWeight: 'bold',
        }}>
        {msgObj.nickname}
      </Text>
      <Text>{msgObj.message}</Text>
    </div>
  )
}

export const App = () => {
  const [id, setId] = useState('');
  const [nickname, setNickname] = useState('');
  const [privateMsg, setPrivateMsg] = useState('');
  const [publicMsg, setPublicMsg] = useState('');
  const [socket] = useSocket(REACT_APP_SERVER_URL);
  const [privateMessages, setPrivateMessages] = useState([])
  const [publicMessages, setPublicMessages] = useState([])

  // const [socket, setSocket] = useState(io(REACT_APP_SERVER_URL));

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log(`Connected; socket ID: ${socket.id}`); // 'G5p5...'
    });

    socket.on('private message', (msgObj) => {
      setPrivateMessages(prevMessages => [...prevMessages, msgObj])
    })

    socket.on('public message', (msgObj) => {
      setPublicMessages(prevMessages => [...prevMessages, msgObj])
    })
  }, [])
 
  const sendMessage = (chatType) => {
    const msgToSend = chatType === "privateChat" ? privateMsg : publicMsg;
    socket.emit('chat message', { message: msgToSend, nickname: nickname } )
  }

  const PrivateMessagesList = () => {
    return privateMessages.map(msg => (<Message key={uuidv4()} msgObj={msg} />))
  }

  const PublicMessagesList = () => {
    return publicMessages.map(msg => (<Message key={uuidv4()} msgObj={msg} />))
  }
  
  return (
    <div className="container">
      <div className="header chatInput" style={{marginTop: "15px", justifyContent: "space-evenly", height: "auto"}}>
        <Heading>Private</Heading>
        <Input style={{width: "20%"}} onChange={(e) => {setNickname(e.target.value)}} placeholder="Enter nickname"/>
        <Heading>Public</Heading>
      </div>
      <div className="chats">
        <Container bg='muted' sx={{ b: '10px', m: '10px', overflow: 'scroll', height: '100%'}} id="privateMessagesBox">
          <PrivateMessagesList />
        </Container>

        <Container bg='muted' sx={{ border: '10px', m: '10px', overflow: 'scroll', height: '100%'}} id="publicMessagesBox">
          <PublicMessagesList />
        </Container>

        <ChatInput chatType="privateChat" inputType="privateInput" changeHandler={setPrivateMsg} clickHandler={sendMessage} />
        <ChatInput chatType="allChat" inputType="allInput" clickHandler={sendMessage} changeHandler={setPublicMsg} />
      </div>
    </div>
  )
}
