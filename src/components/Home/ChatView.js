import React, { useState, useEffect, useRef } from "react";
import "./ChatView.css"; // Import CSS file for styling
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function ChatView() {
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState(null); // Declare chat variable
  const [rows, setRows] = useState(1); // State to manage the number of rows
  const textareaRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null); // Ref to hold typing timeout
  const [CopiedText, setCopiedText] = useState("");

  const handleTextareaKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    } else if (event.key === "Enter" && event.shiftKey) {
      setRows(rows + 1);
    } else {
      // User is typing, set typing indicator

      // Reset typing indicator timeout
      clearTimeout(typingTimeoutRef.current);
      // Set typing indicator to false after 1500ms (1.5 seconds)
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1500);
    }
  };

  const API_KEY = "AIzaSyC6I358RmUE_IErdz9VnwKZjbJQIukHgsI"; // Replace with your actual API key
  const MODEL_NAME = "gemini-1.0-pro"; // You can choose a different model if needed

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
    if (message.trim() === "") {
      return; // Prevent sending empty messages
    }

    const newMessage = { text: message, sender: "user" };
    setMessagesList([...messagesList, newMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      if (chat) {
        // Check if chat is defined
        const message = newMessage.text;
        setIsTyping(true);
        const result = await chat.sendMessage(message);
        const response = result.response;
        const botMessage = {
          text: response.text(),
          sender: "bot",
          align: "right",
        }; // Add align property
        setIsTyping(false);
        setMessagesList([...messagesList, newMessage, botMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      const botMessage = {
        text: "An error occurred. Please try again.",
        sender: "bot",
        align: "right",
      }; // Add align property
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
    // Split text into chunks based on formatting markers and URLs
    const chunks = text.split(/(\*\*|\*|\`\`\`|\b(?:https?|ftp):\/\/[^\s]+)/g);

    // Function to copy text to clipboard
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
      setCopiedText(true);
    };

    let isBold = false; // Track if currently inside a bold text section
    let isItalic = false; // Track if currently inside an italic text section
    let isInCodeBlock = false; // Track if currently inside a code block

    // Map chunks to JSX elements with appropriate formatting
    return chunks.map((chunk, index) => {
      if (chunk === "**") {
        isBold = !isBold; // Toggle bold state
        return null; // Return null as ** has no visible representation
      } else if (chunk === "*") {
        isItalic = !isItalic; // Toggle italic state
        return null; // Return null as * has no visible representation
      } else if (chunk === "```") {
        isInCodeBlock = !isInCodeBlock; // Toggle code block state
        return null; // Return null as ``` has no visible representation
      } else if (isBold) {
        // Render chunk as bold text if inside a bold text section
        return <b key={index}>{chunk}</b>;
      } else if (isItalic) {
        // Render chunk as italic text if inside an italic text section
        return <i key={index}>{chunk}</i>;
      } else if (isInCodeBlock) {
        // Render chunk as code block if inside a code block section
        return (
          <span
            key={index}
            style={{
              position: "relative", // Position the button relative to the code block
              display: "inline-block", 
              // Ensure inline display
            }}
          >
            <button
              onClick={() => {
                // Functionality to copy code to clipboard
                copyToClipboard(chunk);
              }}
              style={{
                position: "absolute", // Position the button absolutely within the code block
                top: "0.5rem", // Adjust top position as needed
                right: "0.5rem", // Adjust right position as needed
                padding: "0.5rem", // Padding for the button
                borderRadius: "0.25rem", // Border radius for the button
                backgroundColor: "#007bff", // Button background color
                color: "#fff", // Button text color
                border: "none", // Remove button border
                cursor: "pointer", // Change cursor to pointer on hover
              }}
            >
              {CopiedText ? "Copied!" : "Copy"}
            </button>
            <span className="code-block">
              {chunk.split("\n").map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  {line}
                  <br /> {/* Add line break after each line */}
                </React.Fragment>
              ))}
            </span>
          </span>
        );
      } else if (chunk.startsWith("http")) {
        // Render URLs as clickable links
        return (
          <a key={index} href={chunk} target="_blank" rel="noopener noreferrer">
            {chunk}
          </a>
        );
      } else {
        // Handle line breaks properly
        return (
          <React.Fragment key={index}>
            {chunk.split("\n").map((line, lineIndex) => (
              <span key={lineIndex}>
                {line}
                <br />
              </span>
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
          <div
            key={index}
            className={msg.sender === "user" ? "user-message" : "other-message"}
          >
            {renderFormattedText(msg.text)}
          </div>
        ))}

        {isTyping && (
          <div
            className="other-message"
            style={{ textAlign: "center", color: "black" }}
          >
            Typing...
          </div>
        )}
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
        <button
          className="send-btn"
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
