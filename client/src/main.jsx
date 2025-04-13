import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { UserProvider } from './contexAPI/userContex.jsx'
import { FolderProvider } from './contexAPI/folderContex.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <UserProvider>
     <FolderProvider>
    <App />
    </FolderProvider>
     </UserProvider>
  </StrictMode>,
)
