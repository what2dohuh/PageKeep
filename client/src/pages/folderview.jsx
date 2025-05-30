import { useParams } from "react-router-dom";
import { File, FileText, FlaskConicalIcon, FolderIcon, Share2, Sparkle, View } from "lucide-react";
import { useEffect, useState } from "react";
// import { Switch } from "@/components/ui/switch";
import '../style/folderview.css'
import ViewFileModal from "../components/Modal/viewfilemodal";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/config_fire";
import TempFlashcardModal from "../components/Modal/tempFlashcardModal";
import {   setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

const FolderView = () => {
  const { folderId } = useParams();
  const [Docs,setDocs] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSummaryBox, setShowSummaryBox] = useState(false);
  const [folderName, setFolderName] = useState("Folder Name"); 
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [summaryText] = useState(
  `React is a JavaScript library for building user interfaces.

Key Concepts:
- Components
- JSX
- State & Props
- Lifecycle Methods`
);
const [isFlashcardModalOpen, setFlashcardModalOpen] = useState(false);
const [flashcardContent, setFlashcardContent] = useState(null);
const [loadingFlashcard, setLoadingFlashcard] = useState(false);
const [flashcardTopic, setFlashcardTopic] = useState('');

    const fetchNotesInFolder = async (folderId) => {
      try {
        const notesQuery = query(
          collection(db, "notes"),
          where("folderId", "==", folderId)
        );
        const querySnapshot = await getDocs(notesQuery);

        const folderQuery = doc(db, "folders", folderId); 
        const folderSnapshot = await getDoc(folderQuery);
       
        if (folderSnapshot.exists()) {
          setFolderName(folderSnapshot.data().name);
        }

        
        const notes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        return notes;
      } catch (error) {
        console.error("Error fetching notes for folder:", error);
        return [];
      }
    };
    useEffect(() => {
      const loadNotes = async () => {
        const notesData = await fetchNotesInFolder(folderId);
        setDocs(notesData); 
      };
      if (folderId) loadNotes();
      console.log("Notes in folder:", Docs);
      setFlashcardTopic(folderName)
    }, [folderId]);


    const generateFlashcard = async (doc)=>{
      setFlashcardModalOpen(true);
      setLoadingFlashcard(true);
  
      try {
        const res = await fetch("http://localhost:3001/generate-flashcard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: doc.title,
            description: doc.description,
            file: doc.fileUrl
          }),
        });
        const data = await res.json();
        console.log("Flashcard data:", data);
  
        if (Array.isArray(data)) {
          setFlashcardContent(data);
        } else if (data.question && data.answer) {
          setFlashcardContent([data]);
        } else {
          setFlashcardContent([]);
        }
  
      } catch (err) {
        console.error("Error generating flashcard:", err);
        setFlashcardContent([{ question: "Error", answer: "Could not generate" }]);
      } finally {
        setLoadingFlashcard(false);
      }
    }

    const handleSaveFlashcards = async () => {
      if (!flashcardTopic) {
        alert("Please enter or select a topic.");
        return;
      }
    
      try {
        const topicRef = doc(db, 'flashcards', flashcardTopic);
        await setDoc(topicRef, {
          name: flashcardTopic,
          createdAt: serverTimestamp(),
          cardCount: 0,
        }, { merge: true });
    
        for (const card of flashcardContent) {
          await addDoc(collection(topicRef, 'cards'), {
            question: card.question,
            answer: card.answer,
            mode: 'auto',
            createdAt: serverTimestamp(),
          });
          await updateDoc(topicRef, {
            cardCount: increment(1),
          });
        }
    
        alert("Flashcards saved successfully!");
        setFlashcardModalOpen(false);
        setFlashcardContent(null);
      } catch (err) {
        console.error("Error saving flashcards:", err);
        alert("Failed to save flashcards. Check console for error.");
      }
    };
    
    
  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      {/* Folder Header */}
      <div className="folder-header">
  <h1 className="folder-title">
   <FolderIcon size={20} color="green" ></FolderIcon>{folderName}
    <Share2 className="w-5 h-5" />
  </h1>
  <div className="toggle-section">
    {isPublic ? "Public" : "Private"}
    {/* Example toggle placeholder */}
    <div
      className={`custom-toggle ${isPublic ? 'active' : ''}`}
      onClick={() => setIsPublic(!isPublic)}
    ></div>
  </div>
</div>
      {/* Document Cards */}
      <div style={{paddingTop: '20px', margin:"10px"}}>
     {isModalOpen && selectedDoc && (
  <ViewFileModal
    onClose={() => {
      setIsModalOpen(false);
      setSelectedDoc(null); // Clear after closing
    }}
    fileData={selectedDoc}
  />
)}
      <section className="recently-viewed">
                    <h2 className="section-subtitle">Your Files</h2>
                    <div className="viewed-cards">
                    {Docs.map((doc) => (
                    <div className="viewed-card" key={doc.id}>
                      <File size={20} color="green" />
                      <h4 className="card-title">{doc.title}</h4>
                      <p className="card-sub">{doc.desc}</p>
                      <p className="card-docs">
                        <FileText size={14} style={{ marginRight: '4px' }} />
                        {doc.fileType || "pdf"}
                      </p>
                      <button
                      className="follow-btn"
                      onClick={() => {
                        setSelectedDoc(doc);   // save selected doc
                        setIsModalOpen(true);  // open modal
                      }}
                    >
                      <View size={14} style={{ marginRight: '6px' }} /> View
                    </button>
                      <button className="follow-btn" onClick={()=>generateFlashcard(doc)}>
                        <FlaskConicalIcon size={14} style={{ marginRight: '6px' }} /> Create Flashcard
                      </button>
                    </div>
                  ))}
                </div>
                    </section>
      </div>

      {/* Summarize All Button */}
      <div className="mt-10 text-center">
      <>
  <button
    className="summarize-all-btn"
    onClick={() => setShowSummaryBox(!showSummaryBox)}
  >
    🔍 Summarize All
  </button>

  {showSummaryBox && (
    <div className="summary-box">
      <h3>📄 Generated Summary</h3>
      <p>{summaryText}</p>
      <button className="save-summary-btn">💾 Save</button>
    </div>
  )}
</>

</div>
{isFlashcardModalOpen && (
  <div className="flashcard-modal-overlay">
    <div className="flashcard-modal">
      <h2 className="flashcard-heading">🧠 Generated Flashcards</h2>
      {loadingFlashcard ? (
        <p>Generating flashcards...</p>
      ) : (
        <div className="flashcard-list">
          {flashcardContent?.map((card, index) => (
            <TempFlashcardModal key={index} question={card.question} answer={card.answer} />
          ))}
         <button onClick={handleSaveFlashcards}
            style={{
              background: 'linear-gradient(to right, #6366F1, #8B5CF6)',
              color: 'white',
              padding: '10px 20px',
              fontSize: '1rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '9999px',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '50%',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            💾 Save This Flashcards
          </button> <button
              style={{
                background: 'linear-gradient(to right, #6A5ACD, #9B5DE5)',
                color: '#fff',
                padding: '12px 24px',
                fontSize: '1.05rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '2rem',
                boxShadow: '0 6px 20px rgba(155, 93, 229, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                width: '50%',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(155, 93, 229, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(155, 93, 229, 0.3)';
              }}
            >
              ⚡ Generate New
            </button>
        </div>
      )}
      <button className="modal-close-btn" onClick={() => setFlashcardModalOpen(false)}>Close</button>
    </div>
  </div>
)}


    </div>
  );
};

export default FolderView;
