import Sidebar from '../components/sidebar';
import '../style/ainotes.css'
const Ainotes = () => {
    return (
        <div className='container-home'>
            <Sidebar/>
            <div className="ainotes-wrapper">
  <h1 className="ainotes-title">Prepare your <span>notes</span> for studying</h1>
  <p className="ainotes-subtitle">
    Quickly turn all your materials into organized 📄 <b>AI Notes</b>, 📚 Quizzes and 🧠 Flashcards
  </p>

  <div className="ainotes-filetypes">
    <div className="ainotes-filecard">
      <p>📄</p>
      <strong>PDF/Doc</strong><br />
      <small>Notes, papers</small>
    </div>
    <div className="ainotes-filecard">
      <p>📝</p>
      <strong>Plain Text</strong><br />
      <small>Copy & paste</small>
    </div>
    <div className="ainotes-filecard">
      <p>📊</p>
      <strong>Slides</strong><br />
      <small>Presentations</small>
    </div>
  </div>

  <div className="ainotes-uploadbox">
    <div style={{ fontSize: '32px' }}>📄🅰📈</div>
    <h3>Upload multiple files</h3>
    <button className="ainotes-browsebtn">Browse your files</button>
    <p className="ainotes-formatnote">supported formats: .pdf, .doc, .docx, .pptx</p>
  </div>

  <p className="ainotes-footnote">
    <b>Terms and Conditions</b> & <b>Privacy Policy</b><br />
    By uploading documents to AiNotes, you represent that you own the copyrights...
  </p>
</div>

        </div>
    );
}

export default Ainotes;
