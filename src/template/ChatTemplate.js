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
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          <p
            className={`capitalize font-bold mb-1 text-sm ${
              message.sender === username
                ? "text-yellow-400"
                : "text-yellow-600"
            }`}
          >
            {message.sender === username ? username : message.sender}
          </p>
          <p className="text-lg">{message.content}</p>
        </div>
      </div>
    ))}
  </div>
  
  );
}

export default ChatTemplate;
