/* eslint-disable react/prop-types */
import  { useState, useEffect } from 'react';
import { Timestamp, updateDoc } from 'firebase/firestore';
import { FaUserCircle, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import '../../style/comment.css'; // Import new CSS for styling

const CommentsCom = ({ user, post }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setComments(post.comments || []);
    }, [post]);

    const handleAddComment = async () => {
        if (newComment.trim() === '') return;
        setLoading(true);

        try {
            const commentData = {
                text: newComment,
                timestamp: Timestamp.fromDate(new Date()),
                user: user.email,
                uid: user.uid,
                id: Date.now()
            };

            const updatedComments = [...comments, commentData];
            setComments(updatedComments);

            await updateDoc(post.ref, {
                comments: updatedComments
            });

            setNewComment('');
        } catch (error) {
            console.error('Error adding comment: ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comments-section-ui">
            <h2><FaUserCircle /> Discussion</h2>

            {user && (
                <div className="comment-input-box">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your comment here..."
                        rows="3"
                        className="comment-textarea"
                    />
                    <button 
                        onClick={handleAddComment} 
                        disabled={loading}
                        className="comment-submit-btn"
                    >
                        {loading ? <FaSpinner className="spin" /> : <><FaPaperPlane /> Post</>}
                    </button>
                </div>
            )}

            <div className="comments-list-ui">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div className="comment-card" key={comment.id}>
                            <div className="comment-user-info">
                                <FaUserCircle className="user-icon" />
                                <span className="comment-username">
                                    {comment.uid === user?.uid ? 'You' : comment.user}
                                </span>
                                <span className="comment-time">
                                    {new Date(comment.timestamp?.seconds * 1000).toLocaleString()}
                                </span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                        </div>
                    ))
                ) : (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};

export default CommentsCom;
