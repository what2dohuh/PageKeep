/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import '../../style/askaiaquestion.css';
import { X } from 'lucide-react';

const AskQuestionModal = ({ isOpen, onClose }) => {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = async () => {
        const trimmed = question.trim();
        if (!trimmed) return;

        setMessages(prev => [...prev, { type: 'user', text: trimmed }]);
        setQuestion('');
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3001/askai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text: trimmed })
            });

            const data = await res.json();
            setMessages(prev => [...prev, { type: 'ai', text: data.reply }]);
        } catch (error) {
            console.error("API error:", error);
            setMessages(prev => [...prev, { type: 'ai', text: "❌ Server error." }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ask-modal-overlay">
            <div className="ask-modal-ai">
                <div className="ask-modal-header">
                    <h3>AI Chat</h3>
                    <button className="ask-close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="ask-modal-body chat-body">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-bubble ${msg.type === 'user' ? 'user-msg' : 'ai-msg'}`}>
                            {msg.text}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="ask-modal-footer chat-footer">
                    <textarea
                        className="ask-textarea"
                        rows="2"
                        placeholder="Ask something..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                    />
                    <button
                        className="ask-submit-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Thinking..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AskQuestionModal;
