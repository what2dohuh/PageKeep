import '../../style/search.css';
import { collectionGroup, getDocs } from "firebase/firestore";
import { db } from '../../config/config_fire';
import { useEffect, useState } from 'react';
import CardCom from './card.com';
import { Link } from 'react-router-dom';
import Homemaincard from './homemaincard';
import Loading from '../loading';
import Fab from '../Fab';

const SearchCom = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [highestlikes, sethighestlikes] = useState({})
  const [loading, setloading] = useState(true);
  
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    // Fetch all posts on mount
    const fetchAllPosts = async () => {
      const q = collectionGroup(db, "post");
      const querySnapshot = await getDocs(q);
      const posts = [];

      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      const highestLikedPost = posts.reduce(
        (max, post) => post.likes > (max.likes || 0) ? post : max,
        posts[0]
      );
      sethighestlikes(highestLikedPost);
      setloading(false);
      setAllPosts(posts);
      setSearchResults(posts); // Default: show all posts
    };

    fetchAllPosts();
  }, []);

  const searchPostsByHeading = (headingToSearch) => {
    if (!headingToSearch.trim()) {
      setSearchResults(allPosts); // Show all if input is empty
      return;
    }

    const filtered = allPosts.filter(post =>
      post.heading?.toLowerCase().includes(headingToSearch.toLowerCase())
    );
    setSearchResults(filtered);
  };
  if (loading) return <Loading/>;

  return (
    <div className="container-search">
      <Fab/>
      <div className="row height d-flex justify-content-center align-items-center">
        <div className="col-md-8">
          <div className="search">
            <i className="fa fa-search"></i>
            <input
              type="text"
              className="form-control"
              placeholder="Search by heading..."
              onChange={(e) => searchPostsByHeading(e.target.value)}
            />
     
          </div>
        </div>
      </div>

      {/* Posts list */}
      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((d) => (
            <Link
              to={`/post/${d.postid}`}
              key={d.id}
              style={{ textDecoration: "none" }}
            >
              <CardCom
                time={d.timestamp}
                title={d.heading}
                img={d.imageUrl}
                descr={d.post}
                username={d.user}
                category={d.category}
                postId={d.postid}
                uid={d.uid}
                initialLikes={d.likes}
              />
            </Link>
          ))
        ) : (
          <p className="no-result">No matching posts found.</p>
        )}
        <Homemaincard data={highestlikes} />
      </div>
    </div>
  );
};

export default SearchCom;
