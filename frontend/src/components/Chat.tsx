import { useEffect, useRef } from 'react';
import { ChatMessage } from '../../../backend/src/models/session';

export default function ChatWindow({ 
    session, 
    user, 
    socket, 
    messages, 
    newMessage, 
    setNewMessage, 
    isMinimized, 
    setIsMinimized, 
    users, 
    unreadCount,
    setUnreadCount
 }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isMinimized && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (unreadCount > 0) {
        setUnreadCount(0);
      }
    }
  }, [messages, isMinimized, unreadCount, setUnreadCount]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    try {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageData = {
            message: newMessage,
            sessionId: session._id,
            sender: user?._id,
            username: user?.username,
            time: currentTime
        }
        
        // Send message to server
        socket?.emit('chatMessage', messageData);
        setNewMessage('');
    } catch(e) {
        console.error(e)
    }
  };

  return (
    <>
    {session && <div className="fixed bottom-0 right-2 z-50 flex flex-col w-100 rounded-lg shadow-xl bg-white border border-gray-200">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg cursor-pointer"
           onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center">
              <span className="text-sm font-bold">{session._id.substring(0, 1).toUpperCase()}</span>
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h3 className="font-medium">Chat Room</h3>
            <p className="text-xs text-blue-200">{users.length} users online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isMinimized && unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          <button className="focus:outline-none">
            {isMinimized ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Online Users */}
      {!isMinimized && (
        <>
          <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {users && users.map((USER, index) => (
                <div key={index} className="flex items-center text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                  <span className={`h-2 w-2 rounded-full ${user ? 'bg-green-500' : 'bg-gray-300'} mr-1`}></span>
                  <span>{USER === user?.username ? 'You' : USER}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-scroll max-h-80 bg-gray-50">
            {messages && messages.map((message: ChatMessage, index) => (
              <div key={index} className={`mb-4 ${message.sender === user?._id ? 'flex justify-end' : 'flex justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${message.sender === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  <div className="text-xs font-semibold mb-1">
                    {message.sender === user?._id ? 'You' : message.username}
                  </div>
                  <div className="text-sm">{message.message}</div>
                  <div className={`text-xs mt-1 ${message.sender === user?._id ? 'text-blue-200' : 'text-gray-500'}`}>
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </>
      )}
    </div>}
    </>
  );
}