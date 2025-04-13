/* eslint-disable react/prop-types */
import { ArrowLeft } from 'lucide-react';
import '../../style/chatview.css';

const ChatView = ({ groupName, onBack }) => {
  return (
    <div className="chat-view">
      <div className="chat-view-header">
        <button className="back-btn" onClick={onBack}><ArrowLeft /> Back</button>
        <div>
          <h4>{groupName} Notes</h4>
          <p>8 students</p>
        </div>
      </div>
      <div className="chat-messages">
        <div className="chat-bubble user1">Hi everyone!</div>
        <div className="chat-bubble user2">Hello! Please share notes</div>
        <div className="chat-bubble user1">Uploading now 📚</div>
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Type your message..." />
        <button>➤</button>
      </div>
    </div>
  );
};

export default ChatView;
