import  { useState } from 'react';
import { CheckCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import '../style/studylist.css';
import Sidebar from '../components/sidebar';

const Studylist = () => {
  const [topic, setTopic] = useState('');
  const [note, setNote] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);
  const [entries, setEntries] = useState([]);

  const handleAdd = () => {
    if (!topic || !note) return;
    const newEntry = {
      topic,
      note,
      link,
      image,
      complete: false,
      collapsed: true,
    };
    setEntries([newEntry, ...entries]);
    setTopic('');
    setNote('');
    setLink('');
    setImage(null);
  };

  const toggleCollapse = (index) => {
    const updated = [...entries];
    updated[index].collapsed = !updated[index].collapsed;
    setEntries(updated);
  };

  const toggleComplete = (index) => {
    const updated = [...entries];
    updated[index].complete = !updated[index].complete;
    setEntries(updated);
  };

  const deleteEntry = (index) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

  return (
    <>
    <div className="studylist-container">
    <Sidebar/>
      <h2>📚 Study List</h2>
      <div className="studylist-form">
        <input
          type="text"
          placeholder="Topic Heading"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          />
        <textarea
          placeholder="Write your notes here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          />
        <input
          type="url"
          placeholder="Reference Link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          />
        <label className="image-upload">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
          />
        </label>
        <button onClick={handleAdd}>+ Add to Studylist</button>
      </div>

      <div className="studylist-entries">
        {entries.map((entry, idx) => (
            <div key={idx} className={`entry-card ${entry.complete ? 'completed' : ''}`}>
            <div className="entry-header">
              <h4>{entry.topic}</h4>
              <div className="entry-actions">
                <button onClick={() => toggleCollapse(idx)} title="Toggle Details">
                  {entry.collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </button>
                <button onClick={() => toggleComplete(idx)} title="Mark Complete">
                  <CheckCircle size={20} color={entry.complete ? '#16a34a' : '#64748b'} />
                </button>
                <button onClick={() => deleteEntry(idx)} title="Delete">
                  <Trash2 size={20} color="#dc2626" />
                </button>
              </div>
            </div>

            {!entry.collapsed && (
              <div className="entry-body">
                <p>{entry.note}</p>
                {entry.link && (
                  <a href={entry.link} target="_blank" rel="noopener noreferrer">
                    🔗 Open Link
                  </a>
                )}
                {entry.image && <img src={entry.image} alt="Note related" />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
        </>
  );
};

export default Studylist;
