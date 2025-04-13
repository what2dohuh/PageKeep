import { useState } from 'react';
import '../../style/tempFlashcarModal.css'
const TempFlashcardModal = ({ question, answer }) => {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <div>
             <div className="flashcard" onClick={() => setShowAnswer(!showAnswer)}>
      <p className="flashcard-question">❓ {question}</p>
      {showAnswer && <p className="flashcard-answer">💡 {answer}</p>}
    </div>
        </div>
    );
}

export default TempFlashcardModal;
