import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import TextField from '@material-ui/core/TextField'
import {Input} from 'theme-ui'
import { Button } from 'theme-ui'
// TODO: Change to prod URL
const socket = io();

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
    <div id={inputType}>
      <Input 
      style={{width: "80%"}}
      
      placeholder="Type message here..."
      />
      <Button>Send</Button>
    </div>
    
  )
}

export const App = () => {
  return (
    <div className="container">
      <div className="header">
        
      </div>
      <div className="chats">
        <ChatInput chatType="privateChat"
        inputType="privateInput" />
        <ChatInput chatType="allChat" inputType="allInput" />

      </div>
    </div>
  )
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
