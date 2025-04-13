import { useState } from 'react';
import { Search, Flame, File } from 'lucide-react';
import GroupCard from '../GroupCard';
import ChatView from './chatview';
import '../../style/chatexplore.css';

const ChatExplore = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  const handleBack = () => {
    setSelectedGroup(null);
  };

  return (
    <div className="chat-explore-container">
      {!selectedGroup ? (
        <>
          <div className="chat-sidebar">
            <h4><Flame size={16}/> Explore</h4>
            <div className="chat-search">
              <Search size={16} />
              <input type="text" placeholder="Find new groups" />
            </div>
            <ul className="chat-filters">
              <li className="active"><Flame size={14}/> Popular</li>
              <li><File size={14}/> All</li>
            </ul>
          </div>

          <div className="chat-main">
            <h6>Popular <span>20 groups • India</span></h6>
            <div className="chat-groups-list">
              <GroupCard
                name="B.COM"
                university="University of Calicut"
                description="Explore B.Com resources and discussions"
                students="2253"
                onClick={() => handleGroupClick("B.COM")}
              />
              <GroupCard
                name="LLB 3 years"
                university="Karnataka State Law University"
                description="Legal studies and case discussion"
                students="1335"
                onClick={() => handleGroupClick("LLB 3 years")}
              />
              {/* Add more groups here */}
            </div>
          </div>
        </>
      ) : (
        <ChatView groupName={selectedGroup} onBack={handleBack} />
      )}
    </div>
  );
};

export default ChatExplore;
