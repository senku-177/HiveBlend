import { useEffect,useRef } from "react";
import './custom-scrollbar.css';
function ChatTemplate({ chatMessages, username }) {
  console.log(chatMessages);
  const chatContainerRef = useRef(null);


  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatMessages]);

  return (
    <div className="p-4 h-full overflow-y-scroll custom-scrollbar" ref={chatContainerRef}>
    {chatMessages.map((message, index) => (
      <div
        key={index}
        className={`flex items-end mb-4 ${
          message.sender === username ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-[80%] px-4 py-2 rounded-lg shadow-lg ${
            message.sender === username
              ? "bg-gray-900 text-white"
              : "bg-blue-900 text-white"
          }`}
        >
          <p
            className={`capitalize font-bold mb-1 text-sm ${
              message.sender === username
                ? "text-blue-200"
                : "text-pink-600"
            }`}
          >
            {message.sender === username ? username : message.sender}
          </p>
          <p className="text-lg">{message.image?(<a href={message.content}>
                                                    <p className="mt-1 mb-2">{message.content}</p>
                                                    <img className='border border-black border-4 rounded-xl 'src={message.content}></img>
                                                  </a>):message.content}</p>
        </div>
      </div>
    ))}
  </div>
  
  );
}

export default ChatTemplate;
