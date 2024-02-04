import { useEffect,useRef } from "react";

function ChatTemplate({ chatMessages, username }) {
  console.log(chatMessages);
  const chatContainerRef = useRef(null);


  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatMessages]);

  return (
    <div className="border p-4 h-full overflow-y-scroll" ref={chatContainerRef}>
      {chatMessages.map((message, index) => (
        <div
          key={index}
          className={`flex items-end mb-2 ${
            message.sender === username ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] px-4 py-2 rounded-lg ${
              message.sender === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            <p
              className={`capitalize font-bold mb-1 text-xs ${
                message.sender === "user"
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
