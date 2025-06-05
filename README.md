# 📚 PageKeep – Smart Note Sharing & AI Learning Assistant

**PageKeep** is a modern web platform designed to make studying smarter and more collaborative. Share notes, organize them in folders, and use AI-powered tools to generate summaries, flashcards, and quizzes. PageKeep also lets you interact with AI based on your uploaded content and soon, chat with peers in topic-based group discussions.

---

## ✨ Features

### 🗂️ Notes & Material Sharing
- Upload PDFs, images, and links
- Organize files into personal folders
- Share materials with visibility control (public/private)

### 🤖 Gemini AI Integration
- 📄 **Summarization** – Generate smart summaries from uploaded PDFs or images
- 🧠 **Flashcards** – Automatically generate topic-wise flashcards for revision
- ❓ **Quiz Generator** – Create question-answer quizzes from your study materials
- 💬 **AI Chat on PDF** – Interact with Gemini AI directly based on the content of your PDF

### 💬 Community & Collaboration *(Upcoming)*
- 🔥 Group chats based on topics
- 💡 Discover and join study groups

---

## 🛠️ Built With

- **Frontend**: [React.js](https://react.dev/)
- **Backend & Storage**: [Firebase (Firestore, Storage, Auth)](https://firebase.google.com/)
- **AI Integration**: [Gemini API (Google AI Studio)](https://makersuite.google.com/)
- **UI/UX**: Clean responsive layout, drag-and-drop upload, modal components

---

## 🚀 How to Use

1. **Sign up or Log in** using Firebase Authentication.
2. **Create folders** to manage your notes.
3. **Upload** study materials (PDFs/images/links).
4. Choose to:
   - 🧾 Generate **summary**
   - 🧠 Generate **flashcards**
   - ❓ Generate **quizzes**
5. Chat with Gemini AI about the content of any file you upload.
6. *(Soon)* Join group chats based on your subjects or topics.

---

## 📁 Folder & File Structure

Each user has:
- A private space to manage folders and notes
- Options to set public visibility for sharing
- Real-time updates using Firestore

---


## 🔒 Security

- All files are stored securely in **Firebase Storage**
- Access rules restrict visibility and file access based on ownership or public status
- AI queries are scoped to only user-authorized data

---

## 📌 Future Features

- ✅ Topic-based **group chat**
- ✅ File comment system
- 📊 Study analytics dashboard
- 🎓 Community-shared quiz bank
- 📱 Mobile app version

---

```bash
cd pagekeep
npm install
npm start
