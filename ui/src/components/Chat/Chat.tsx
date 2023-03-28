import { useState, useEffect, useRef } from 'react';
import { useEwokContext } from '../../context/EwokContext';
import './Chat.css';


const Chat = () => {
    let { socket, ewok } = useEwokContext();
    const [messages, setMessages] = useState<messages>({messages: [], currentMessage: ""});
    const [chatVisible, setChatVisible] = useState<boolean>(false);

    const handleChatUpdate = (update: any) => {
        if ( update.server !== ewok.server ) return;
        const tmpMessages = {...messages};
        tmpMessages.messages.push(update.message);
        tmpMessages.currentMessage = '';
        setMessages(tmpMessages);
        if ( chatVisible && ewok.team !== 'Instructor' && update.sender === 'Instructor' ) alert('Message')
    };
    
    useEffect(() => {
        socket.on('CHAT_API', handleChatUpdate);
    }, [socket]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if ( messages.currentMessage === "") return;
        const date = new Date();
        const time = `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
        const newMessage = {
            time: time,
            sender: ewok.team === 'Instructor' ? 'Instructor': 'Student',
            message: messages.currentMessage
            };
        socket.emit('CHAT', {server: ewok.server, message: newMessage});
    };
  
    const handleChange = (e: any) => {
      setMessages({ ...messages, currentMessage: e.target.value });
    };

    const containerRef = useRef<any>(null)
    useEffect(() => {
      if(containerRef && containerRef.current) {
        const element = containerRef.current;
        element.scroll({
          top: element.scrollHeight,
          left: 0,
          behavior: "smooth"
        })
      };
    }, [containerRef, messages])

    return (
        <div className='Chat'>
        <button onClick={() => setChatVisible(!chatVisible)}>Show/Hide Chat</button>
        {chatVisible && <>
            <form onSubmit={e => handleSubmit(e)}>
                <input
                    className="currentMessage"
                    type="text"
                    placeholder="Type your message"
                    value={messages.currentMessage}
                    onChange={e => handleChange(e)}
                />
            </form>
            <div className='messages' ref={containerRef}>
                {[...new Set(messages.messages)].map((message, index) => (
                    <div key={index} className={`chat-${message.sender}`}>
                        <div>
                            {message.time}
                        </div>
                        <div>
                            {message.message}
                        </div>
                    </div>
                ))}
            </div>
        </>}
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
