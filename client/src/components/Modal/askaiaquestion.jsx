/* eslint-disable react/prop-types */
import { useState } from 'react';
import '../../style/askaiaquestion.css';
import { X } from 'lucide-react';

const AskQuestionModal = ({ isOpen, onClose }) => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const GEMINI_API_KEY = "AIzaSyCwNUqXGsgciYECrajlIvria36cD0WL12I"; // Replace this securely later

    const handleSubmit = async () => {
        if (!question.trim()) return;

        setLoading(true);
        setResponse('');

        try {
            const res = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [{ text: question }],
                                role: "user"
                            }
                        ]
                    }),
                }
            );

            const data = await res.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
            setResponse(generatedText);
        } catch (error) {
            console.error("Gemini API error:", error);
            setResponse("❌ Error fetching response.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ask-modal-overlay">
            <div className="ask-modal">
                <div className="ask-modal-header">
                    <h3>Ask a Question</h3>
                    <button className="ask-close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <div className="ask-modal-body">
                    <textarea 
                        className="ask-textarea"
                        rows="5"
                        placeholder="Type your question here..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <div className="ask-response-box">
                        {loading ? (
                            <p className="ask-loading-text">Generating response...</p>
                        ) : (
                            response && <p className="ask-response-text">{response}</p>
                        )}
                    </div>
                </div>
                <div className="ask-modal-footer">
                    <button className="ask-submit-btn" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AskQuestionModal;
