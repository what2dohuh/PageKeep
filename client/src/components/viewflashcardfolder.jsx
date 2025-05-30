import { Folder, View } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/config_fire'; 
import '../style/viewflashcard.css'; 

const ViewFlashcardFolders = () => {
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
    
    // useEffect(() => {
    //     console.log("Fetched topics:", topics);
    // }, [topics]);
    
    return (
        <div className="flashcard-folder-page">
            <h2>📂 Your Flashcard Topics</h2>
            <div className="folder-grid">
                {topics.map(topic => (
                    <div key={topic.id} className="folder-box">
                        <Folder size={20} />
                        <h4>{topic.id}</h4>
                        <Link to={`/flashcards/${topic.id}`}>
                            <button className="view-btn">
                                <View size={14} style={{ marginRight: '6px' }} /> View Flashcards
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewFlashcardFolders;
