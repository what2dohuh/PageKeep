import '../style/mylibrary.css';
import { BookOpen, FileText, Folder, UploadCloud, View, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, storage, auth } from '../config/config_fire';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, increment, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Loading from '../components/loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useFolders } from '../contexAPI/folderContex';
import { onAuthStateChanged } from 'firebase/auth';
const formatRelativeTime = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString(); // fallback to full date
};

const Mylibrary = () => {
  
  const [dragActive, setDragActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDesc, setNoteDesc] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolder, setNewFolder] = useState("");
  const [recentNotes, setRecentNotes] = useState([]);
  // const [myFolders, setMyFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  
  const { myFolders, fetchFolders } = useFolders();

  const fetchRecentNotes = async () => {
    const user = auth.currentUser;
    if (!user) return;
  
    try {
      const notesQuery = query(
        collection(db, 'notes'),
        where('uploaderId', '==', user.uid),
        limit(6) // recent 5 notes, you can adjust this
      );
      const notesSnap = await getDocs(notesQuery);
  
      const notes = notesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(0),
      }));
  
      // Sort by createdAt descending
      notes.sort((a, b) => b.createdAt - a.createdAt);
      setRecentNotes(notes);
    } catch (error) {
      console.error("Error fetching recent notes:", error);
    }
  };
  const [authResolved, setAuthResolved] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchRecentNotes();
        fetchFolders();
      }
      setAuthResolved(true);
    });
  
    return () => unsubscribe();
  }, []);
  
  if (!authResolved) return <Loading />;
  
    
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowModal(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setShowModal(true);
    }
  };

  const triggerFileInput = () => {
    inputRef.current.click();
  };

  const handleUpload = async () => {
    try {
      const folderName = newFolder || selectedFolder;
      const user = auth.currentUser;
      
      if (!user) {
        alert("Please login to upload notes.");
        return;
      }
      
      setLoading(true);

      const storageRef = ref(storage, `notes/${user.uid}/${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);
      const fileUrl = await getDownloadURL(storageRef);
  
      // 2. Handle folder creation/check
      let folderId = null;
  
      if (folderName) {
        const folderQuery = query(collection(db, 'folders'), where('name', '==', folderName), where('ownerId', '==', user.uid));
        const folderSnapshot = await getDocs(folderQuery);
  
        if (folderSnapshot.empty) {
          const folderDoc = await addDoc(collection(db, 'folders'), {
            name: folderName,
            ownerId: user.uid,
            createdAt: serverTimestamp(),
            noteCount: 1, // new field
          });          
          folderId = folderDoc.id;
        } else {
          folderId = folderSnapshot.docs[0].id;
          const folderRef = doc(db, 'folders', folderId);
          await updateDoc(folderRef, {
            noteCount: increment(1)
          });

        }
      }
  
      // 3. Save note metadata to Firestore
      await addDoc(collection(db, 'notes'), {
        title: noteTitle,
        description: noteDesc,
        uploaderId: user.uid,
        folderId: folderId || null,
        fileUrl,
        visibility: "private",
        createdAt: serverTimestamp(),
      });
      await fetchFolders();
      await fetchRecentNotes(); // Add this
      toast("Uploading Successful!");      
      setLoading(false);
      setShowModal(false);
      setNoteTitle("");
      setNoteDesc("");
      setSelectedFolder("");
      setNewFolder("");
      setSelectedFile(null);
  
    } catch (error) {
      console.error("Error uploading note:", error);
      alert("Something went wrong. Try again!");
      setLoading(false);
    }
  };

  return (
    <div className="study-session-page">
      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for courses, books or documents"
          className="search-input"
        />
      </div>

      {/* Upload Section */}
      <div className="ai-session">
        <div
          className={`upload-card ${dragActive ? 'drag-active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={inputRef}
            className="upload-input"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
          <UploadCloud size={32} color="#3b82f6" />
          <p className="upload-title">Click or drag & drop to upload</p>
          <p className="upload-desc">
            ✨ Use AI to summarize, rephrase, quiz<br />
            ✨ Create flashcards, study plans
          </p>
        </div>

        <div className="study-plan-card">
          <BookOpen size={32} color="#ff7e54" />
          <p className="upload-title">Start a study plan to nail your next exam</p>
          <p className="upload-desc">
            ✨ Plan your study<br />
            ✨ Generate quizzes from documents<br />
            ✨ Collaborate with classmates <span className="new-tag">New</span>
          </p>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
  loading ? (
    <Loading />
  ) : (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={() => setShowModal(false)}>
          <X size={18} />
        </button>
        <h3>Upload Notes</h3>

        <input
          type="text"
          placeholder="Title"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          className="modal-input"
        />

        <textarea
          placeholder="Description (optional)"
          value={noteDesc}
          onChange={(e) => setNoteDesc(e.target.value)}
          className="modal-input"
        ></textarea>

        <select
          className="modal-input"
          value={selectedFolder}
          onChange={(e) => {
            setSelectedFolder(e.target.value);
            setNewFolder(""); // clear new folder if one is selected
          }}
        >
          <option value="">Select Existing Folder</option>
          {myFolders.map(folder => (
            <option key={folder.id} value={folder.name}>
              {folder.name}
            </option>
          ))}
        </select>

        {/* Only show this if no folder is selected */}
        {!selectedFolder && (
          <input
            type="text"
            placeholder="Or create a new folder"
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
            className="modal-input"
          />
        )}

        <button className="upload-confirm-btn" onClick={handleUpload}>
          Upload
        </button>
      </div>
    </div>
  )
)}


      {/* Uploads and Courses */}
      <div className="section">
              <h3 className="section-title">Recent uploads</h3>
              {recentNotes.length === 0 ? (
                <p>No notes uploaded yet.</p>
              ) : (
                recentNotes.map((note) => (
                  <div className="upload-row" key={note.id}>
                    <FileText size={20} />
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      {note.title}
                    </a>
                    <span className="time-badge">{formatRelativeTime(note.createdAt)}</span>
                    <button className="upload-button"> Uploaded</button>
                  </div>
                ))
              )}
        </div>

      
            <div className="section">
              <h3 className="section-title">My courses</h3>
              <div className="course-box">
                <p><strong>Find courses to follow</strong> and start your own library.</p>
                <button className="add-course-button">+ Add Courses</button>
              </div>
            </div>
            <section className="recently-viewed">
        <h2 className="section-subtitle">Your Folders</h2>
        <div className="viewed-cards">
          {myFolders.length === 0 ? (
            <p>No folders yet.</p>
          ) : (
            myFolders.map(folder => (
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
      <ToastContainer/>
    </div>
  );
};

export default Mylibrary;
