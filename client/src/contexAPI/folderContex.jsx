/* eslint-disable react/prop-types */
// src/context/FolderContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { db, auth } from '../config/config_fire';
import { collection, query, where, getDocs } from 'firebase/firestore';

const FolderContext = createContext();

export const useFolders = () => useContext(FolderContext);

export const FolderProvider = ({ children }) => {
  const [myFolders, setMyFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(true);

  const fetchFolders = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const foldersQuery = query(
        collection(db, 'folders'),
        where('ownerId', '==', user.uid)
      );

      const folderSnap = await getDocs(foldersQuery);

      const folderList = await Promise.all(folderSnap.docs.map(async (doc) => {
        const data = doc.data();
        const folderId = doc.id;

        const notesInFolderQuery = query(
          collection(db, 'notes'),
          where('uploaderId', '==', user.uid),
          where('folderId', '==', folderId)
        );
        const notesSnap = await getDocs(notesInFolderQuery);

        return {
          id: folderId,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(0),
          noteCount: notesSnap.size,
        };
      }));

      folderList.sort((a, b) => b.createdAt - a.createdAt);
      setMyFolders(folderList);
      setLoadingFolders(false);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <FolderContext.Provider value={{ myFolders, fetchFolders, loadingFolders,refresh: fetchFolders  }}>
      {children}
    </FolderContext.Provider>
  );
};
