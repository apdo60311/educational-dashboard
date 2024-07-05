import React, { useState, useEffect } from "react";
import "../styles/AccessCodeManager.css";
import { firestore } from "../config/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const AccessCodeManager = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [accessCodes, setAccessCodes] = useState([]);

  useEffect(() => {
    const fetchAccessCodes = async () => {
      const unsubscribe = onSnapshot(
        collection(firestore, "access_codes"),
        (snapshot) => {
          const codesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAccessCodes(codesData);
        }
      );
      return () => unsubscribe();
    };

    fetchAccessCodes();
  }, []);

  const addAccessCode = async () => {
    if (!code.trim()) {
      setError("Access code is required");
      return;
    }

    const collectionRef = collection(firestore, "access_codes");
    const docRef = doc(collectionRef, code);

    await setDoc(docRef, {
      code,
    });

    setCode("");
    setError("");
  };

  const removeAccessCode = async (id) => {
    await deleteDoc(doc(firestore, "access_codes", id));
  };

  return (
    <div className="access-code-manager">
      <h2>Manage Access Codes</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Access Code"
      />
      {error && <p className="error">{error}</p>}
      <button onClick={addAccessCode}>Add Access Code</button>
      <div className="access-codes-list">
        <h3>Access Codes</h3>
        <ul>
          {accessCodes.map((accessCode) => (
            <li key={accessCode.id}>
              {accessCode.id}
              <button onClick={() => removeAccessCode(accessCode.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccessCodeManager;
