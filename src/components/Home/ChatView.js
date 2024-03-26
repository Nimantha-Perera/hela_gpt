import React, { useState, useEffect,useRef } from 'react';
import './ChatView.css'; // Import CSS file for styling
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function ChatView() {
  const [message, setMessage] = useState('');
  const [messagesList, setMessagesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState(null); // Declare chat variable
  const [rows, setRows] = useState(1); // State to manage the number of rows
  const textareaRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null); // Ref to hold typing timeout

  const handleTextareaKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    } else if (event.key === 'Enter' && event.shiftKey) {
      setRows(rows + 1);
    } else {
      // User is typing, set typing indicator
 
      // Reset typing indicator timeout
      clearTimeout(typingTimeoutRef.current);
      // Set typing indicator to false after 1500ms (1.5 seconds)
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1500);
    }
  };


  const API_KEY = 'AIzaSyC6I358RmUE_IErdz9VnwKZjbJQIukHgsI'; // Replace with your actual API key
  const MODEL_NAME = 'gemini-1.0-pro'; // You can choose a different model if needed

  useEffect(() => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9, // Adjust as needed
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      // Add safety settings as desired
    ];

    const chatInstance = model.startChat({
      generationConfig,
      safetySettings,
      history: [], // Initial chat history
    });

    setChat(chatInstance); // Set chat instance

    // Return a cleanup function from useEffect if needed
    return () => {
      // Cleanup logic if any
    };
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      return; // Prevent sending empty messages
    }

    const newMessage = { text: message, sender: 'user' };
    setMessagesList([...messagesList, newMessage]);
    setMessage('');
    setIsLoading(true);
  

    try {
      if (chat) { // Check if chat is defined
        const message = newMessage.text;
        setIsTyping(true);
        const result = await chat.sendMessage(message);
        const response = result.response;
        const botMessage = { text: response.text(), sender: 'bot', align: 'right' }; // Add align property
        setIsTyping(false);
        setMessagesList([...messagesList, newMessage, botMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const botMessage = { text: 'An error occurred. Please try again.', sender: 'bot', align: 'right' }; // Add align property
      setMessagesList([...messagesList, newMessage, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  // const translateText = async (text) => {
  //   const options = {
  //     method: 'POST',
  //     url: 'https://microsoft-translator-text.p.rapidapi.com/BreakSentence',
  //     params: {
  //       'api-version': '3.0'
  //     },
  //     headers: {
  //       'content-type': 'application/json',
  //       'X-RapidAPI-Key': 'b52b12a177msh6af0189d06ce120p1cf2d0jsn651f854c0b57',
  //       'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
  //     },
  //     data: [
  //       {
  //         Text: text
  //       }
  //     ]
  //   };
    
  //   try {
  //     const response = await axios.request(options);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  const renderFormattedText = (text) => {
    // Split text into chunks based on formatting markers
    const chunks = text.split(/(\*\*|\*|\`\`\`)/g);
  
    // Function to copy text to clipboard
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
    };
  
    // Map chunks to JSX elements with appropriate formatting
    return chunks.map((chunk, index) => {
      if (chunk.startsWith('**')) {
 
        return <b key={index}>{chunks[index + 0]}</b>;
      } else if (chunk === '*') {
        return <i key={index}>{chunks[index + 0]}</i>;
      } else if (chunk === '```') {
        return (
          <div key={index} style={{ position: 'relative' }}>
            <pre style={{ backgroundColor: 'black', color: "white" }}>{chunks[index + 1]}</pre>
            <button
              onClick={() => copyToClipboard(chunks[index + 1])}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                padding: '5px 10px',
                borderRadius: '5px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Copy
            </button>
          </div>
        );
      } else {
        // Handle line breaks
        const lines = chunk.split('\n');
        return (
          <React.Fragment key={index}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>{line}<br /></span>
            ))}
          </React.Fragment>
        );
      }
    });
    
  };
  
  

  return (
    <div className="chat-container">
      <div className="messages">
        {messagesList.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user-message' : 'other-message'}>
            {renderFormattedText(msg.text)}
          </div>
        ))}
         {isTyping && <div className="other-message" style={{ textAlign: 'center' ,color:"white"}}>Typing...</div>}
      </div>
      <div className="input-container">
      <textarea
        className="message-input"
        placeholder="Type your message..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleTextareaKeyDown}
        rows={rows} // Dynamically set the number of rows
        ref={textareaRef}
      />
      <button className="send-btn" onClick={handleSendMessage} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>

    </div>
  );
}
