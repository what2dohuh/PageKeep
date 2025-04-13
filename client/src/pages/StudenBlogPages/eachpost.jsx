import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../style/eachpost.css';
import { collectionGroup, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../config/config_fire';
import Timeform from '../../components/timeform';
import { onAuthStateChanged } from 'firebase/auth';
import ComentsCom from '../../components/StudentBlogcom/coments.com';
import Loading from '../../components/loading';
import { FaHeart, FaCalendarAlt, FaUser, FaTag, FaCommentDots } from 'react-icons/fa';

const Eachpost = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likes, setLikes] = useState(0);
    const [upvoted, setUpvoted] = useState(false);
    const [likesuid, setlikesuid] = useState([]);
    const [user, setuser] = useState(null);
    const ViewContent = ({ htmlContent }) => {
        return (
          <div
            className="content-render"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        );
      };
      
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (us) => {
            const getData = async () => {
                try {
                    setuser(us || null);
                    const querySnapshot = await getDocs(collectionGroup(db, "post"));
                    let foundPost = null;

                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (data.postid === postId) {
                            foundPost = { ...data, id: doc.id, ref: doc.ref };
                        }
                    });

                    if (foundPost) {
                        setPost(foundPost);
                        setLikes(foundPost.likes || 0);
                        setlikesuid(foundPost.likesuid || []);
                    } else {
                        setError('No such post!');
                    }
                } catch (error) {
                    setError('Error fetching post! ' + error);
                } finally {
                    setLoading(false);
                }
            };
            getData();
        });

        return () => unsubscribe();
    }, [postId]);

    useEffect(() => {
        if (post) {
            setLikes(post.likes || 0);
            if (!user) {
                setUpvoted(true);
                return;
            }
            setUpvoted(likesuid.includes(user?.uid) || false);
        }
    }, [post, user, likesuid]);

    const handleUpvote = async () => {
        if (!upvoted && user) {
            const newLikes = likes + 1;
            setLikes(newLikes);
            setUpvoted(true);
            const newLikesUid = [...likesuid, user.uid];
            setlikesuid(newLikesUid);

            if (post && post.ref) {
                try {
                    await updateDoc(post.ref, {
                        likes: newLikes,
                        likesuid: newLikesUid
                    });
                } catch (error) {
                    console.error("Error updating likes:", error);
                }
            }
        }
    };

    if (loading) return <div><Loading /></div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="each-post-container">
            {post && (
                <div className="post-details">
                    <h1 className="post-title">{post.heading}</h1>
                    <img src={post.imageUrl} alt={post.heading} className="post-image" />
                    <p className="post-category"><FaTag /> {post.category}</p>
                    <p className="post-description" dangerouslySetInnerHTML={{ __html: post.post }}></p>
                    <ViewContent htmlContent={post?.post} />
                    <p className="post-author"><FaUser /> {post.user}</p>
                    <p className="post-date"><FaCalendarAlt /> <Timeform time={post.timestamp} /></p>
                    <p className="post-likes"><FaHeart style={{ color: 'crimson' }} /> {likes}</p>
                    <button
                        className={`upvote-btn ${upvoted ? 'upvoted' : ''}`}
                        onClick={handleUpvote}
                        disabled={upvoted}
                    >
                        <FaHeart />
                        {upvoted ? 'Upvoted' : 'Upvote'} ({likes})
                    </button>
                </div>
            )}
            <div className="comments-section">
                <h2><FaCommentDots /> Comments</h2>
                <ComentsCom user={user} post={post} />
            </div>
        </div>
    );
};

export default Eachpost;
