/* eslint-disable react/prop-types */
import { useState } from 'react';
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
    const [flippedCards, setFlippedCards] = useState([]);
    const toggleCard = (index) => {
      setFlippedCards((prev) =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    };

    const fileUrl = fileData?.fileUrl || 'https://example.com/sample.pdf'; 


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

                    {/* Right - Flashcards */}
                
                    <div className="flashcard-list">
                    {fileData?.flashcards?.length > 0 ? (
                      fileData.flashcards.map((fc, i) => (
                        <div
                          className={`flashcard-box ${flippedCards.includes(i) ? 'flipped' : ''}`}
                          key={i}
                          onClick={() => toggleCard(i)}
                        >
                          {!flippedCards.includes(i) ? (
                            <div className="flashcard-front"><strong>Q:</strong> {fc.question}</div>
                          ) : (
                            <div className="flashcard-back"><strong>A:</strong> {fc.answer}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No flashcards available.</p>
                    )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ViewFileModal;
