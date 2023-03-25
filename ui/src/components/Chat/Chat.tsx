import { useState } from 'react';
import './Chat.css';
import { useEwokContext } from '../../context/EwokContext';

const Chat = () => {
    const ewok = useEwokContext();
    const [messages, setMessages] = useState<messages>({messages: [], currentMessage: ""});
    
    const handleSubmit = (e: any) => {
      e.preventDefault();
      const date = new Date();
      const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      const tmpMessages = [...messages.messages];
      tmpMessages.push(`${time} [${ewok.ewok.team}]:`);
      tmpMessages.push(messages.currentMessage);
      setMessages({ messages: tmpMessages, currentMessage: "" });
      // TODO: push to everyone on server
    };
  
    const handleChange = (e: any) => {
      setMessages({ ...messages, currentMessage: e.target.value });
    };
  
    return (
    <div className='Chat'>
        <span>{`Chat (${messages.messages.length/2})`}</span>
        <div className='messages'>
            {messages.messages.map((message, index) => (
                <div key={index} className={`chat-${ewok.ewok.team}`}>
                {message}
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
    messages: string[], 
    currentMessage: string
}

    