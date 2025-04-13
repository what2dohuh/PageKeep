/* eslint-disable react/prop-types */
// src/context/UserContext.js
import { onAuthStateChanged } from 'firebase/auth';
import  { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/config_fire';
import { collectionGroup, doc, getDoc, getDocs } from 'firebase/firestore';

// Create context
const UserContext = createContext();

// Custom hook for consuming context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [userData,setUserData] = useState(null);
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const fetchUserData = async () => {
          try {
            const querySnapshot = await getDocs(collectionGroup(db, "post"));
            const postsArray = querySnapshot.docs
              .filter(doc => doc.data().uid === user.uid)
              .map(doc => doc.data());
              
            if (isMounted) setData(postsArray);
  
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);
  
            if (isMounted) {
              if (docSnap.exists()) {
                setUserData(docSnap.data());
              } else {
                setUserData({ name: "Guest user" });
              }
            }
          } catch (err) {
            setError(err);
          } finally {
            if (isMounted) setLoading(false);
          }
        };
        fetchUserData();
      } else {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    });
  
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser,data,setLoading,loading,userData,error,logout }}>
      {children}
    </UserContext.Provider>
  );
};
