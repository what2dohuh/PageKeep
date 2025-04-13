/* eslint-disable react/prop-types */
import '../../style/chatmodal.css';
import { EyeClosed, Plus, Users } from 'lucide-react';
import ChatExplore from './chatexplore';
import { useState } from 'react';

const ChatModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('explore'); // explore | create

  if (!isOpen) return null;

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="chat-modal-header">
          <h2>{tab === 'explore' ? 'Explore Groups' : 'Create Group'}</h2>
          <button className="close-btn"onClick={onClose}><EyeClosed size={14} /></button>
        </div>

        <div className="chat-modal-body">
          {tab === 'explore' ? <ChatExplore /> : <div className="create-group-placeholder">Coming Soon: Create Group UI</div>}
        </div>

        <div className="chat-modal-tabbar">
          <button className={tab === 'explore' ? 'active' : ''} onClick={() => setTab('explore')}>
            <Users size={16} /> Explore
          </button>
          <button className={tab === 'create' ? 'active' : ''} onClick={() => setTab('create')}>
            <Plus size={16} /> Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
