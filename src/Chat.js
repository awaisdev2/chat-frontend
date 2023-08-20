import React, {useRef} from 'react';

export default function Chat({ username, socket, room }) {
    const [message, setMessage] = React.useState("");
    const [messageList, setMessageList] = React.useState([]);
    const chatContainerRef = useRef(null);

    const sendMsg = async () => {
        if (message !== "") {
            const messageData = {
                author: username,
                message: message,
                room: room,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };
            await socket.emit("send_message", messageData);
            setMessage("");
        }
    };

    React.useEffect(() => {
        const receiveMessage = (data) => {
            setMessageList((list) => [...list, data]);
        };
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        socket.on("receive_message", receiveMessage);
    
        return () => {
            socket.off("receive_message", receiveMessage);
        };
    }, [socket,messageList]);
    

    return (
        <div>
            <div className="chat-header container">
                <h1>Realtime chat</h1>
            </div>
            <div className="chat-body" ref={chatContainerRef}
                style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                }}> 
                {messageList.map((messageContent, index) => (
                   <div
                   key={index}
                   className={`message ${messageContent.author === username ? 'message-sender' : 'message-receiver'}`} >
                        <p style={{width: 'fit-content'}} className='fw-bold'>{messageContent.message}</p>
                        <span className="message-author mx-1">{messageContent.author}</span>
                        <span className="message-time mx-1">{messageContent.time}</span>
                    </div>
                ))}
            </div>
            <div className="align-items-center d-flex container px-5">
                <input
                    type="text"
                    placeholder='Enter a message'
                    className="chat-input form-control my-3 mx-5"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && message.trim() !== '') {
                            sendMsg();
                        }
                    }}
                />
                <button
                    disabled={message === ''}
                    onClick={sendMsg}
                    className="btn-sm btn btn-primary"
                    style={{height: '40px'}}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
