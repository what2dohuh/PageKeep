import { useEffect, useState } from 'react';
import { Editor } from 'primereact/editor';
import '../../style/createpost.css';
import { auth, db } from '../../config/config_fire';
import { collection, setDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../components/loading';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [heading, setHeading] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return `${time} min read`;
  };

  useEffect(() => {
    if (!auth.currentUser) {
      toast("Login to create a post!!");
      nav('/');
    }
  }, []);

  const uploadImageAndGetURL = async () => {
    if (image) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    }
    return '';
  };

  const handlePost = async () => {
    if (!heading || !category || !image) {
      toast("Please fill in all required fields and upload an image.");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImageAndGetURL();
      const userDocRef = doc(db, "posts", auth.currentUser.uid);
      const postsCollectionRef = collection(userDocRef, "post");
      const newPostRef = doc(postsCollectionRef);

      await setDoc(newPostRef, {
        uid: auth.currentUser.uid,
        heading,
        post: text,
        imageUrl,
        category,
        timestamp: new Date(),
        likes: 0,
        comments: [],
        user: auth.currentUser.email,
        postid: newPostRef.id
      });

      toast("Post created successfully!");
      nav('/');
    } catch (err) {
      toast(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  const handleSaveDraft = async () => {
    try {
      const userDocRef = doc(db, "drafts", auth.currentUser.uid);
      const draftCollection = collection(userDocRef, "post");
      const draftRef = doc(draftCollection);

      await setDoc(draftRef, {
        uid: auth.currentUser.uid,
        heading,
        post: text,
        imageUrl: image ? URL.createObjectURL(image) : '',
        category,
        timestamp: new Date(),
        user: auth.currentUser.email,
        postid: draftRef.id,
        isDraft: true
      });

      toast("Draft saved!");
    } catch (err) {
      toast(`Error saving draft: ${err.message}`);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="create-post-container">
        <h2 className="create-post-title">📝 Create Post</h2>

        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="Enter a heading..."
          className="heading-input"
        />

        <Editor
          value={text}
          onTextChange={(e) => setText(e.htmlValue)}
          style={{ height: '320px' }}
          className="editor"
        />

        <p className="read-time">⏱️ Estimated read time: {calculateReadTime(text)}</p>

        {!image && (
          <label
            htmlFor="file-upload"
            className="drag-drop-box"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files.length) {
                setImage(e.dataTransfer.files[0]);
              }
            }}
          >
            📤 <strong>Upload Cover Image</strong>
            <span>Drag & drop or click to upload</span>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>
        )}

        {image && (
          <div className="image-preview-container">
            <img
              src={URL.createObjectURL(image)}
              alt="Selected Preview"
              className="selected-image"
            />
          </div>
        )}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="">Select a category</option>
          <option value="Technology">💻 Technology</option>
          <option value="Health">🩺 Health</option>
          <option value="Education">📚 Education</option>
          <option value="Entertainment">🎬 Entertainment</option>
          <option value="Sports">🏆 Sports</option>
        </select>

        <div className="buttons">
          <button className="post-button" onClick={handlePost}>📬 Post</button>
          <button className="draft-button" onClick={handleSaveDraft}>💾 Save as Draft</button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreatePost;
