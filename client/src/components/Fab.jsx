import { useState } from 'react';
import '../style/fab.css';
import { useNavigate } from 'react-router-dom';
const Fab = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
  
    const toggleOptions = () => {
      setIsOpen(!isOpen);
    };
    return (
        <div className="fab-container">
        {isOpen && (
          <div className="fab-options">
            <div
              className="fab-option"
              onClick={() => navigate("/createpost")}
            >
              📄 New Post
            </div>
            <div
              className="fab-option"
              onClick={() => navigate("/mylibrary")}
            >
              📚 Upload Notes
            </div>
            <div
              className="fab-option"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              ⬆ Scroll Top
            </div>
          </div>
        )}
  
        <div className="fab" onClick={toggleOptions}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`fab-icon ${isOpen ? "rotate" : ""}`}
          >
            <path
              fill="white"
              d="M12 5v14M5 12h14"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    );
}

export default Fab;
