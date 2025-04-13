import Signup from "./auth/signup";
import { BrowserRouter , Routes,Route } from 'react-router-dom'
import Home from "./home";
import Login from "./auth/login";
import Profile from "./pages/profile";
import NavbarCom from "./components/navbar.com";
import Notfoundpage from "./pages/notfoundpage";
import SearchCom from "./components/StudentBlogcom/search.com";
import Mylibrary from "./pages/mylibrary";
import FolderView from "./pages/folderview";
import Ainotes from "./pages/ainotes";
import YourNotes from "./pages/yourNotes";
import Studylist from "./pages/studylist";
import CreatePost from "./pages/StudenBlogPages/createPost";
import Eachpost from "./pages/StudenBlogPages/eachpost";

function App() {
  return (
    <>
    <BrowserRouter>
    <NavbarCom/>
    
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/home" element={<YourNotes />} />
    <Route path="/" element={<Home />} />
    <Route path="/createpost" element={<CreatePost />} />
    <Route path="/post/:postId" element={<Eachpost/>} />
    <Route path="/profile" element={<Profile/>} />
    <Route path="/studentblog" element={<SearchCom/>} />
    <Route path='/mylibrary' element={<Mylibrary/>} />
    <Route path="/folder/:folderId" element={<FolderView/>} />
    <Route path="/ainotes" element={<Ainotes/>} />
    <Route path="/studylist" element={<Studylist/>} />

    <Route path="*" element={<Notfoundpage/>} />
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
