/* eslint-disable react/prop-types */
import  { useState, useRef, useEffect } from 'react';
import '../style/profilecom.css';
import { Link } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/config_fire';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useUser } from '../contexAPI/userContex';

const ProfileCom = () => {
  const { userData,user,data,loading} = useUser();
  const [about, setAbout] = useState(userData?.about|| 'Edit Your About so others can see...');
  const [name, setName] = useState(userData?.name || 'Name');
  // eslint-disable-next-line no-unused-vars
  const [sucess, setsucess] = useState(false);
  const [image, setImage] = useState(userData?.profileImg || "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"); // Image state
  const fileInputRef = useRef(null); // Use a ref to trigger file input
  
  useEffect(() => {
    if (userData) {
      setAbout(userData.about || 'Edit your about...');
      setName(userData.name || '');
      setImage(userData.profileImg || 'default-img-url');
    }
  }, [userData]);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click(); // Trigger the file input when image is clicked
  };

  const handleUpdate = async () => {
    try {
      let imageUrl = image
      if (image instanceof File) {
        const storage = getStorage(); // Get the Firebase Storage instance
        const storageRef = ref(storage, `profiles/${image.name}`); // Create a storage reference
        const snapshot = await uploadBytes(storageRef, image); // Upload the image
        imageUrl = await getDownloadURL(snapshot.ref); // Get the download URL
      }
      const userRef = doc(db, 'users', user.uid); // Reference to the Firestore document
      await updateDoc(userRef, {
        name: name,
        about: about,
        profileImg:imageUrl
        // Add logic to update the image URL if necessary (after uploading to a storage service like Firebase Storage)
      });
      setsucess(true);
      toast('Successfully updated'); // Trigger toast with success message
    } catch (error) {
      console.error("Error updating profile: ", error);
      setsucess(false);
      toast('Failed to update'); // Trigger toast with error message
    }
  };
  if (loading || !userData ) return <p>Loading...</p>; // 
  return (
    <>
      <div className="row py-5 px-4">
        <div className="col-md-5 mx-auto">
          {/* Profile widget */}
          <div className="bg-white shadow rounded overflow-hidden">
            {/* Cover Section */}
            <div className="px-4 pt-0 pb-4 cover">
              <div className="media align-items-end profile-head">
                <div className="profile mr-3">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: 'none' }} // Hide the file input
                  />

                  {/* Clickable Profile Image */}
                  <img
                   src={image instanceof File ? URL.createObjectURL(image) : image}
                    alt="Profile"
                    width="130"
                    className="rounded mb-2 img-thumbnail"
                    onClick={handleImageClick} // Trigger file input on image click
                    style={{ cursor: 'pointer' }} // Make it look clickable
                  />
                  <a href="#" className="btn btn-outline-dark btn-sm btn-block" onClick={handleUpdate}>
                    Save Change
                  </a>
                </div>
                <div className="media-body mb-5 text-white">
                  <h4 className="mt-0 mb-0">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </h4>
                  <p className="small mb-4">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-light p-4 d-flex justify-content-end text-center">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <h5 className="font-weight-bold mb-0 d-block">215</h5>
                  <small className="text-muted">
                    <i className="fas fa-image mr-1"></i>Photos
                  </small>
                </li>
                <li className="list-inline-item">
                  <h5 className="font-weight-bold mb-0 d-block">745</h5>
                  <small className="text-muted">
                    <i className="fas fa-user mr-1"></i>Followers
                  </small>
                </li>
                <li className="list-inline-item">
                  <h5 className="font-weight-bold mb-0 d-block">340</h5>
                  <small className="text-muted">
                    <i className="fas fa-user mr-1"></i>Following
                  </small>
                </li>
              </ul>
            </div>

            {/* About Section */}
            <div className="px-4 py-3">
              <h5 className="mb-0">About</h5>
              <input
                className="p-4 rounded shadow-sm bg-light"
                style={{ width: '100%' }} // Ensures the input takes full width
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>

            {/* Recent Photos Section */}
            <div className="py-4 px-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0">Recent post</h5>
              </div>
              <div className="row">
                {!data ? (
                      <p>Loading posts...</p>
                    ) : data.length === 0 ? (
                      <p>No posts found.</p>
                    ) : (
                      data.map((d) => (
                        <div className="col-lg-6 mb-2 pr-lg-1" key={d.postid}>
                          <Link to={`/post/${d.postid}`}>
                            <img
                              style={{ width: '100%', height: '100%' }}
                              src={d.imageUrl}
                              alt=""
                              className="img-fluid rounded shadow-sm"
                            />
                          </Link>
                        </div>
                      ))
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Toast Container should be placed here */}
    </>
  );
};

export default ProfileCom;
