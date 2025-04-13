/* eslint-disable react/prop-types */
import '../../style/flashcardmodal.css';
import { X, FileImage, Save, SparkleIcon, Eye } from 'lucide-react';
import { useState, useRef } from 'react';

const FlashcardModal = ({ isOpen, onClose }) => {
    const [autoMode, setAutoMode] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    if (!isOpen) return null;

    const handleAutoGenerateClick = () => setAutoMode(true);
    const handleManualClick = () => setAutoMode(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            console.log("Dropped files:", files);
        }
    };

    const handleFileSelect = () => inputRef.current.click();

    return (
        <div className="flashcard-modal-overlay">
            <div className="flashcard-modal" onDragEnter={handleDrag}>
                <div className="flashcard-modal-header">
                    <h3>{autoMode ? 'Auto Generate Flashcard' : 'Create Flashcard'}</h3>
                    <button className="flashcard-close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="flashcard-modal-body">
                    {autoMode ? (
                        <>
                            <textarea
                                placeholder="Paste content here... (e.g. topic or notes)"
                                className="flashcard-textarea"
                                rows="4"
                            />
                            <input 
                                type="text" 
                                placeholder="Difficulty (easy / medium / hard)" 
                                className="flashcard-input" 
                            />
                              <div 
                                className={`drop-zone ${dragActive ? 'active' : ''}`} 
                                onDrop={handleDrop} 
                                onDragOver={handleDrag} 
                                onDragLeave={handleDrag}
                                onClick={handleFileSelect}
                            >
                                <FileImage size={18} style={{ marginBottom: '8px' }} />
                                <p>Drag & drop image or PDF here<br/>or click to browse</p>
                                <input 
                                    type="file" 
                                    accept="image/*,application/pdf" 
                                    ref={inputRef} 
                                    hidden 
                                />
                            </div>
                            <select className="folder-select">
                        <option>Add to existing folder</option>
                        <option>Create new folder</option>
                    </select>
                    <input type="text" placeholder="New folder name (if creating)" className="folder-input" />
                        </>
                    ) : (
                        <>
                            <input 
                                type="text" 
                                placeholder="Enter term/question" 
                                className="flashcard-input" 
                            />
                            <textarea 
                                placeholder="Enter answer/definition" 
                                className="flashcard-textarea" 
                                rows="3"
                            />

                            {/* Drag-and-drop zone */}
                            <div 
                                className={`drop-zone ${dragActive ? 'active' : ''}`} 
                                onDrop={handleDrop} 
                                onDragOver={handleDrag} 
                                onDragLeave={handleDrag}
                                onClick={handleFileSelect}
                            >
                                <FileImage size={18} style={{ marginBottom: '8px' }} />
                                <p>Drag & drop image or PDF here<br/>or click to browse</p>
                                <input 
                                    type="file" 
                                    accept="image/*,application/pdf" 
                                    ref={inputRef} 
                                    hidden 
                                />
                            </div>
                            <select className="folder-select">
                        <option>Add to existing folder</option>
                        <option>Create new folder</option>
                    </select>
                    <input type="text" placeholder="New folder name (if creating)" className="folder-input" />
                        </>
                    )}
                </div>

                <div className="flashcard-modal-footer">
                    <div className="footer-actions">
                        <button 
                            className="flashcard-submit-btn green-btn" 
                            onClick={handleAutoGenerateClick}
                        >
                            <SparkleIcon size={16} style={{ marginRight: 6 }} />
                            Auto Generate
                        </button>

                        {!autoMode && (
                            <button className="flashcard-submit-btn">
                                <Save size={16} style={{ marginRight: 6 }} />
                                Save Flashcard
                            </button>
                        )}

                        {autoMode && (
                            <button 
                                className="flashcard-submit-btn blue-btn"
                                onClick={handleManualClick}
                            >
                                Back to Manual
                            </button>
                        )}

                        <button className="flashcard-submit-btn secondary">
                            <Eye size={16} style={{ marginRight: 6 }} />
                            View Flashcards
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashcardModal;
