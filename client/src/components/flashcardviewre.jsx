import { useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/config_fire';
import { useEffect, useState } from 'react';
import '../style/flashcardviewer.css';

const FlashcardViewer = () => {
    const { topic } = useParams();
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const fetchCards = async () => {
            const snap = await getDocs(collection(db, `flashcards/${topic}/cards`));
            const data = snap.docs.map(doc => doc.data());
            setCards(data);
        };
        fetchCards();
    }, [topic]);

    return (
        <div className="flashcard-viewer">
            <h2>🧠 Flashcards - {topic}</h2>
            <div className="card-list">
                {cards.map((card, i) => (
                    <div key={i} className="flashcard-item">
                        <h4>Q: {card.question || card.term}</h4>
                        <p><strong>A:</strong> {card.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlashcardViewer;
