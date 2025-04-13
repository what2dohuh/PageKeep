import { Link } from "react-router-dom";
import {  useState } from "react";
import AskQuestionModal from "./Modal/askaiaquestion";
import { MessageSquare } from "lucide-react";
import ChatModal from "./Modal/chatmodal";
import { useUser } from "../contexAPI/userContex";

const Sidebar = () => {
  const { user,userData } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);


  return (
    <aside className="sidebar">
      <Link to='/profile'>
        <div className="profile">
          <div className="avatar">
            <img
              src={userData?.profileImg || "https://ui-avatars.com/api/?name=Guest+User"}
              alt="User Avatar"
              className="avatar-img"
            />
          </div>
          <div className="profile-info">
            <p className="username">{user ? userData?.name : "Guest User"}</p>
            <p className="add-school">+ Add your university or school</p>
          </div>
        </div>
      </Link>

      <button className="new-button">+ New</button>

      <nav className="nav">
        <Link to='/'><div className="nav-item">Home</div></Link>
        <Link to='/mylibrary'><div className="nav-item">My Library</div></Link>
        <Link to='/ainotes'><div className="nav-item">AI Notes <span className="badge">New</span></div></Link>
        <div className="nav-item" onClick={() => setModalOpen(true)}>Ask AI</div>
        <div className="nav-item">Recent</div>
        <div className="nav-item">Courses</div>
        <div className="nav-item">Books</div>
        <Link to='/studylist'><div className="nav-item">Studylists</div></Link>
        <button className="action-button" onClick={() => setChatModalOpen(true)}>
          <MessageSquare size={16} style={{ marginRight: '8px' }} /> Open Chat
        </button>
      </nav>

      <AskQuestionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <ChatModal isOpen={chatModalOpen} onClose={() => setChatModalOpen(false)} />
    </aside>
  );
};

export default Sidebar;
