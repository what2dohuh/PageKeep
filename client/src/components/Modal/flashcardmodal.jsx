/* eslint-disable react/prop-types */
import { addDoc, collection } from 'firebase/firestore';
import '../../style/flashcardmodal.css';
import { X, FileImage, Save, SparkleIcon, Eye } from 'lucide-react';
import { useState, useRef } from 'react';
import { db } from '../../config/config_fire';
import {  doc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';


const FlashcardModal = ({ isOpen, onClose }) => {
    const [autoMode, setAutoMode] = useState(false);
    const [dragActive, setDragActive] = useState(false);
        
    const [topic, setTopic] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [content, setContent] = useState('');

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

    const saveFlashcard = async () => {
        if (!topic) {
            alert("Please enter a topic.");
            return;
        }
    
        const flashcardData = autoMode
            ? {
                content,
                difficulty,
                mode: 'auto',
                createdAt: serverTimestamp()
            }
            : {
                question,
                answer,
                mode: 'manual',
                createdAt: serverTimestamp()
            };
    
        try {
            const topicRef = doc(db, 'flashcards', topic);
    
            // Step 1: Ensure topic document exists (merge to avoid overwriting)
            await setDoc(topicRef, {
                name: topic,
                createdAt: serverTimestamp(),
                cardCount: 0,
            }, { merge: true });
    
            // Step 2: Add flashcard to the `cards` subcollection
            await addDoc(collection(topicRef, 'cards'), flashcardData);
    
            // Step 3: Increment card count
            await updateDoc(topicRef, {
                cardCount: increment(1),
            });
    
            alert("Flashcard saved successfully!");
            onClose?.();
    
            // Reset fields after saving
            setQuestion('');
            setAnswer('');
            setContent('');
            setDifficulty('');
        } catch (err) {
            console.error("Error saving flashcard:", err);
            alert("Failed to save flashcard. Check console for error.");
        }
    };
    


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
                         <input 
                            type="text" 
                            placeholder="Enter topic" 
                            className="flashcard-input"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                        <textarea
                            placeholder="Paste content here... (e.g. topic or notes)"
                            className="flashcard-textarea"
                            rows="4"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <input 
                            type="text" 
                            placeholder="Difficulty (easy / medium / hard)" 
                            className="flashcard-input"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
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
                 
                        </>
                    ) : (
                        <>
                           <input 
                            type="text" 
                            placeholder="Enter topic" 
                            className="flashcard-input"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                        <input 
                            type="text" 
                            placeholder="Enter term/question" 
                            className="flashcard-input"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <textarea 
                            placeholder="Enter answer/definition" 
                            className="flashcard-textarea"
                            rows="3"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
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
                <button className="flashcard-submit-btn" onClick={saveFlashcard}>
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
