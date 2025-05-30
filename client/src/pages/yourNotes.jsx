import { Search, PlusCircle, Sparkles,FlaskConicalIcon, MessageSquare, Edit3, Folder, FileText, Star, View, Eye } from 'lucide-react';
import Sidebar from '../components/sidebar';
import '../style/yournotes.css'; 
import {  Link, useNavigate } from 'react-router-dom';
import Fab from '../components/Fab';
import { useEffect, useState } from 'react';
import AskQuestionModal from '../components/Modal/askaiaquestion';
import SummarizeModal from '../components/Modal/summarize';
import FlashcardModal from '../components/Modal/flashcardmodal';
import CreateQuizModal from '../components/Modal/createquiz';
import { useUser } from '../contexAPI/userContex';
import { useFolders } from '../contexAPI/folderContex';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/config_fire';
const YourNotes = () => {
    const { user } = useUser();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isSummarizeModalOpen, setSummarizeModalOpen] = useState(false);
    const [ISFlashcardOpen, setISFlashcardOpen] = useState(false);
    const [IsQuizOpen, setISQuizOpen] = useState(false);
    const nav = useNavigate();
    const {myFolders}  = useFolders();

    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const snap = await getDocs(collection(db, 'flashcards'));
                console.log("Snapshot size:", snap.size); 
            
                snap.forEach(doc => {
                    console.log("Doc ID:", doc.id, "Data:", doc.data());
                });
        
                const folders = snap.docs.map(doc => ({ id: doc.id }));
                setTopics(folders);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };
        fetchTopics();        
    }, []);

    useEffect(() => {
            if (user) {
                    nav('/home');
                    }
                    else{
                        nav('/');
                    }

        },[user])
        
    return (
        <>
        {user &&  (
        <div className="container-home">
             <Fab/>
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <main className="main-content">
                <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search for courses, books or documents" 
                        className="search-bar"
                    />
                </div>

                <div className="actions">
                    <button className="action-button" onClick={() => setISQuizOpen(true)}>
                        <Edit3 size={16} style={{ marginRight: '8px' }} /> Create a quiz
                    </button>
                    <button className="action-button" onClick={() => setModalOpen(true)}>
                        <MessageSquare size={16} style={{ marginRight: '8px' }} /> Ask a Question
                    </button>
                    <button className="action-button" onClick={() => setSummarizeModalOpen(true)}>
                    <Sparkles size={16} style={{ marginRight: '8px' }} /> Summarize your notes
                    </button>
                    <button className="action-button" onClick={() => setISFlashcardOpen(true)}>
                        <FlaskConicalIcon size={16} style={{ marginRight: '8px' }} /> Create Flashcard
                    </button>
                </div>
                <AskQuestionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
                <FlashcardModal isOpen={ISFlashcardOpen} onClose={() => setISFlashcardOpen(false)} />
            <SummarizeModal isOpen={isSummarizeModalOpen} onClose={() => setSummarizeModalOpen(false)} />
            <CreateQuizModal isOpen={IsQuizOpen} onClose={() => setISQuizOpen(false)} />

                <section className="welcome-section">
                    <h2 className="section-title">Welcome to StudyChain 🙌</h2>
                    <p className="section-desc">This is your home, the starting point to discover the best study material.</p>
                    <div className="welcome-box">
                        <div className="welcome-text">
                            <p className="bold">Supercharge your studies!</p>
                            <p>Unlock <strong>exclusive features</strong> and stay ahead.</p>
                            
                            {/* <Link to="/signup"><button className="account-button"><LogInIcon/></button></Link> */}
                        </div>
                        <div className="welcome-image"><img width="100%" src="../src/assets/student.gif"/></div>
                    </div>
                </section>

                    
                    <section className="recently-viewed">
                            <h3 className="section-subtitle">Flashcards You Created</h3>
                            <div className="viewed-cards">
                            {topics.map(topic => (
                                console.log("Topic ID:", topics),
                                <div className="flashcard-card" key={topic.id}>
                                    <Folder size={20} color="white" />
                                    <h4 className="card-title">{topic.id}</h4>
                                    <p className="card-sub">Your flashcards</p>
                                    <p className="card-docs">
                                        <FileText size={14} style={{ marginRight: '4px' }} />
                                        {topic.cardCount || 0} Flashcard{(topic.cardCount || 0) !== 1 ? 's' : ''} organized
                                    </p>
                                    <Link to={`/flashcards/${topic.id}`}>
                                        <button className="follow-btn">
                                            <View size={14} style={{ marginRight: '6px' }} /> View
                                        </button>
                                    </Link>
                                </div>
                            ))}
                                {/* <div className="flashcard-card">
                                    <Folder size={20} color="white" />
                                    <h4 className="card-title">Operating Systems Flashcards</h4>
                                    <p className="card-sub">B.Tech • 2nd Year</p>
                                    <p className="card-docs">
                                        <FileText size={14} style={{ marginRight: '4px' }} />
                                        42 flashcards
                                    </p>
                                    <Link to="/view-flashcards">    
                                    <button className="flashcard-submit-btn secondary">
                                        <Eye size={16} style={{ marginRight: 6 }} />
                                        View Flashcards
                                    </button>
                                </Link>

                                </div> */}
                            </div>
                        </section>
                        
                <section className="trending-section">
                    <h3 className="section-subtitle">Trending in your courses</h3>
                    <p><strong>Follow courses</strong> and get tailored recommendations!</p>
                    <button className="add-course">
                        <PlusCircle size={14} style={{ marginRight: '6px' }} /> Add Courses
                    </button>
                </section>
             <section className="recently-viewed">
  <h2 className="section-subtitle">Your Folders</h2>
  <div className="viewed-cards">
    {myFolders.length === 0 ? (
      <p>No folders yet.</p>
    ) : (
      [...myFolders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(folder => (
          <div className="viewed-card" key={folder.id}>
            <Folder size={20} color="green" />
            <h4 className="card-title">{folder.name}</h4>
            <p className="card-sub">Your personal folder</p>
            <p className="card-docs">
              <FileText size={14} style={{ marginRight: '4px' }} />
              {folder.noteCount} note{folder.noteCount !== 1 ? 's' : ''} organized
            </p>

            <Link to={`/folder/${folder.id}`}>
              <button className="follow-btn">
                <View size={14} style={{ marginRight: '6px' }} /> View
              </button>
            </Link>
          </div>
        ))
    )}
  </div>
</section>

                    <section className="ai-section">
                    <h3 className="section-subtitle">AI Questions</h3>
                    <p className="section-note">You are not following any courses with questions. Ask new questions by clicking the Ask AI button below.</p>
                </section>


            </main>

        </div>)}
    </>
    );
}

export default YourNotes;
