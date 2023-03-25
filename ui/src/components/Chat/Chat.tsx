import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Chat.css';
import { useEwokContext } from '../../context/EwokContext';
import { useEffect } from 'react';

const Chat = () => {
    const location = useLocation();
    const [info, setInfo] = useState<any>({team:'0', server:'0'})
    useEffect(() => {
        let search = location.search.split("?")
        const tmpInfo = {...info, team: search[1], server: search[2]};
        setInfo(tmpInfo);
    },[location])
    const ewok = useEwokContext();
    const [messages, setMessages] = useState<messages>({messages: [], currentMessage: ""});

    const handleSubmit = (e: any) => {
      e.preventDefault();
      const date = new Date();
      const time = `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
      const tmpMessages = [...messages.messages];
      const newMessage = {
        time: time,
        sender: ewok.ewok.team,
        message: messages.currentMessage
      };
      tmpMessages.push(newMessage);
      setMessages({ messages: tmpMessages, currentMessage: "" });
      // TODO: push to everyone on server 
    };
  
    const handleChange = (e: any) => {
      setMessages({ ...messages, currentMessage: e.target.value });
    };
  
    const header = document.getElementById('header');
    header?.remove();

    return (
    <div className='Chat'>
        <div className='messages'>
            {messages.messages.map((message, index) => (
                <div key={index} className={`chat-${info.team}`}>
                    <div>
                        {message.time}
                    </div>
                    <div>
                        {message.message}
                    </div>
                </div>
            ))}
        </div>
        <form onSubmit={e => handleSubmit(e)}>
        <input
            className="currentMessage"
            type="text"
            placeholder="Type your message"
            value={messages.currentMessage}
            onChange={e => handleChange(e)}
        />
        </form>
    </div>
    );
};
  
export default Chat;
  
interface messages {
    messages: {
        time: string,
        sender: string,
        message: string
    }[], 
    currentMessage: string
}
