/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import '../../style/summarize.css';
import { X, FileImage, FolderPlus } from 'lucide-react';
import { addDoc, collection, doc, getDocs, increment, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { auth, db, storage } from '../../config/config_fire';
import 'react-toastify/dist/ReactToastify.css';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';
import { useFolders } from '../../contexAPI/folderContex';

const SummarizeModal = ({ isOpen, onClose }) => {
    const [state, setState] = useState({
        dragActive: false,
        summary: '',
        description: '',
        loading: false,
        selectedFile: null,
        noteTitle: '',
        selectedFolder: '',
        newFolder: ''
    });

    const { myFolders, refresh } = useFolders();
   
      
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setState(prev => ({
            ...prev,
            dragActive: e.type === "dragenter" || e.type === "dragover"
        }));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setState(prev => ({ ...prev, dragActive: false }));
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setState(prev => ({ ...prev, selectedFile: files[0] }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setState(prev => ({ ...prev, selectedFile: file }));
    };

    const handleBrowseClick = () => inputRef.current?.click();

    const handleGenerate = async () => {
        if (!state.selectedFile) {
            toast.warning("Please select or drop a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", state.selectedFile);
        formData.append("description", state.description);
        console.log(state.description)

        setState(prev => ({ ...prev, loading: true }));
        
        try {
            const res = await fetch("http://localhost:3001/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            setState(prev => ({
                ...prev,
                summary: data.summary || "No summary received.",
                loading: false
            }));
        } catch (err) {
            console.error(err);
            setState(prev => ({
                ...prev,
                summary: "Failed to summarize the file.",
                loading: false
            }));
            toast.error("Failed to generate summary");
        }
    };
    useEffect(() => {
        console.log("Modal open state:", isOpen);
      }, [isOpen]);

    const handleUpload = async () => {
        console.log("Upload started");
        const {
            newFolder,
            selectedFolder,
            selectedFile,
            noteTitle,
            description,
            summary
        } = state;

        try {
            const folderName = newFolder || selectedFolder;
            const user = auth.currentUser;

            if (!user) {
                toast.warning("Please login to upload notes.");
                return;
            }

            if (!selectedFile) {
                toast.warning("Please select a file first.");
                return;
            }

            if (!noteTitle) {
                toast.warning("Please add a title for your summary.");
                return;
            }

            setState(prev => ({ ...prev, loading: true }));

            // 1. Upload file to Firebase Storage
            const storageRef = ref(storage, `summaries/${user.uid}/${selectedFile.name}`);
            await uploadBytes(storageRef, selectedFile);
            const fileUrl = await getDownloadURL(storageRef);

            // 2. Handle folder (create if doesn't exist)
            let folderId = null;

            if (folderName) {
                const folderQuery = query(
                    collection(db, 'folders'),
                    where('name', '==', folderName),
                    where('ownerId', '==', user.uid)
                );
                const folderSnapshot = await getDocs(folderQuery);

                if (folderSnapshot.empty) {
                    const folderDoc = await addDoc(collection(db, 'folders'), {
                        name: folderName,
                        ownerId: user.uid,
                        createdAt: serverTimestamp(),
                        noteCount: 1,
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

            // 3. Save note metadata in Firestore
            await addDoc(collection(db, 'notes'), {
                title: noteTitle,
                description,
                uploaderId: user.uid,
                folderId: folderId || null,
                fileUrl,
                summary,
                visibility: "private",
                createdAt: serverTimestamp(),
            });

            await refresh();

            toast.success("Summary uploaded successfully!");

            // Reset state
            setState({
                dragActive: false,
                summary: '',
                description: '',
                loading: false,
                selectedFile: null,
                noteTitle: '',
                selectedFolder: '',
                newFolder: ''
            });
            toast.success("Summary uploaded successfully!");
            console.log("Calling onClose()");
            setTimeout(() => {
                onClose(); // Let toast show for a bit
            }, 1000);
        

        } catch (error) {
            console.error("Error uploading summary:", error);
            toast.error("Upload failed. Please try again.");
            setState(prev => ({ ...prev, loading: false }));
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="ask-modal-overlay">
            <div className="ask-modal" onDragEnter={handleDrag}>
                <div className="ask-modal-header">
                    <h3>Summarize Your Notes</h3>
                    <button className="ask-close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="ask-modal-body">
                    <input
                        type="text"
                        name="noteTitle"
                        placeholder="Enter summary title"
                        value={state.noteTitle}
                        onChange={handleInputChange}
                        className="folder-input"
                    />

                    <div
                        className={`drop-zone ${state.dragActive ? 'active' : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onClick={handleBrowseClick}
                    >
                        <FileImage size={20} style={{ marginBottom: '8px' }} />
                        <p>Drag & drop image or PDF here<br />or click to browse</p>
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            ref={inputRef}
                            onChange={handleFileChange}
                            hidden
                        />
                    </div>

                    <textarea
                        className="summary-text"
                        name="description"
                        rows="4"
                        placeholder="Add a description (optional)..."
                        value={state.description}
                        onChange={handleInputChange}
                    />

                    <div className="summary-preview">
                        <strong>Summary Output:</strong>
                        <p>{state.loading ? "Generating summary..." : state.summary || "Your summarized text will appear here..."}</p>
                    </div>

                    <select
                        className="folder-select"
                        name="selectedFolder"
                        value={state.selectedFolder}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Folder</option>
                       {myFolders.map(folder => (
    <option key={folder.id} value={folder.name}>
        {folder.name} ({folder.noteCount || 0})
    </option>
))}

                        <option value="__new__">+ Create New Folder</option>
                    </select>

                    {state.selectedFolder === "__new__" && (
                        <input
                            type="text"
                            name="newFolder"
                            placeholder="Enter new folder name"
                            value={state.newFolder}
                            onChange={handleInputChange}
                            className="folder-input"
                        />
                    )}
                </div>

                <div className="ask-modal-footer">
                    <button
                        className="ask-submit-btn"
                        onClick={handleGenerate}
                        disabled={state.loading || !state.selectedFile}
                    >
                        {state.loading ? "Generating..." : "Generate"}
                    </button>
                    <button
                        className="ask-submit-btn"
                        onClick={handleUpload}
                        disabled={state.loading || !state.noteTitle || !state.selectedFile}
                    >
                        <FolderPlus size={16} style={{ marginRight: 6 }} />
                        {state.loading ? "Saving..." : "Save Summary"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SummarizeModal;