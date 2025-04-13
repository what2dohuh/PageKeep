/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';
import '../../style/createquiz.css';
import { X, FileImage, SparkleIcon, Save } from 'lucide-react';

const CreateQuizModal = ({ isOpen, onClose }) => {
    const [autoMode, setAutoMode] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

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

    if (!isOpen) return null;

    return (
        <div className="quiz-modal-overlay">
            <div className="quiz-modal">
                <div className="quiz-modal-header">
                    <h3>{autoMode ? "Auto Generate Quiz" : "Create Quiz"}</h3>
                    <button className="quiz-close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="quiz-modal-body">
                    <div className="quiz-toggle">
                        <button 
                            className={`quiz-toggle-btn ${!autoMode ? 'active' : ''}`}
                            onClick={handleManualClick}
                        >
                            Manual
                        </button>
                        <button 
                            className={`quiz-toggle-btn ${autoMode ? 'active' : ''}`}
                            onClick={handleAutoGenerateClick}
                        >
                            Auto Generate
                        </button>
                    </div>

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

                    {autoMode ? (
                        <textarea
                            className="quiz-textarea"
                            rows="3"
                            placeholder="Enter topic (e.g., Easy / Medium / Advanced)"
                        />
                    ) : (
                        <>
                            <input 
                                type="text" 
                                className="quiz-input" 
                                placeholder="Enter question" 
                            />
                            <textarea
                                className="quiz-textarea"
                                rows="3"
                                placeholder="Enter options or answer here..."
                            />
                        </>
                    )}

                    <select className="quiz-folder-select">
                        <option>Add to existing folder</option>
                        <option>Create new folder</option>
                    </select>

                    <input 
                        type="text" 
                        placeholder="New folder name (if creating)" 
                        className="quiz-folder-input" 
                    />
                </div>

                <div className="quiz-modal-footer">
                    <button className="quiz-submit-btn">
                        <Save size={16} style={{ marginRight: 6 }} />
                        Save Quiz
                    </button>
                    {autoMode && (
                        <button className="quiz-submit-btn green">
                            <SparkleIcon size={16} style={{ marginRight: 6 }} />
                            Generate Questions
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateQuizModal;
