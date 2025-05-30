/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import '../../style/viewfilemodal.css';
import { FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const formatRelativeTime = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString(); // fallback to full date
};

const ViewFileModal = ({ onClose ,fileData}) => {
 

    const fileUrl = fileData?.fileUrl || 'https://example.com/sample.pdf'; 
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    
    const handleSendMessage = () => {
      if (!userInput.trim()) return;
    
      const newMessage = { sender: "user", text: userInput };
      const botReply = {
        sender: "ai",
        text: "This is a placeholder response from the AI.",
      };
    
      setChatMessages((prev) => [...prev, newMessage, botReply]);
      setUserInput("");
    };
    
    const chatRef = useRef(null);
// Add this effect
useEffect(() => {
  if (chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
}, [chatMessages]);
    return (
                    <div className="viewfile-modal-overlay">
                        <div className="viewfile-modal">
                        <div className="modal-header">
                  <h2>View File</h2>
                  <p className="file-meta">
                  <strong>Title:</strong> {fileData?.title || 'Untitled'}<br />
                  <strong>Folder:</strong> {fileData?.folder || 'N/A'}<br />
                  <strong>Uploaded:</strong> {
                    fileData?.createdAt
                      ? formatRelativeTime(new Date(fileData.createdAt.seconds * 1000))
                      : 'Unknown'
                  }
                </p>
              <FaTimes onClick={onClose} className="close-icon" style={{ cursor: 'pointer' }} />
            </div>


                <div className="modal-content-grid">
                    {/* Left - Summary */}
                    <div className="modal-section summary-section">
                    <ReactMarkdown >
                      {fileData?.summary || 'No summary available.'}
                    </ReactMarkdown>

                    {/* <iframe src={fileData?.fileUrl} title="PDF Preview" className="file-iframe" /> */}
                    </div>

                    {/* Center - File Preview */}
                    <div className="modal-section file-preview-section">
                        <h3>File</h3>
                        <iframe src={fileUrl} title="PDF Preview" className="file-iframe" />
                    </div>

                  
               {/* Right - AI Chat */}
                <div className="modal-section chat-section">
                  <h3 className="chat-title">💬 Ask AI about this file</h3>
                  <div className="chat-messages" ref={chatRef}>
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`chat-message ${msg.sender}`}>
                        <div className="chat-bubble">{msg.text}</div>
                      </div>
                    ))}
                  </div>
                  <div className="chat-input-wrapper">
                    <input
                      type="text"
                      placeholder="Ask something..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage}>Send</button>
                  </div>
                </div>


                </div>
            </div>
        </div>
    );
};

export default ViewFileModal;
