import React, { useState, useEffect } from "react";
import "../styles/StudentManager.css";
import { firestore } from "../config/firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

const StudentManager = () => {
  const [selectedEducationalStage, setSelectedEducationalStage] = useState("");
  const [educationalStages] = useState([
    "الصف الاول الثانوي",
    "الصف الثاني الثانوي",
    "الصف الثالث الثانوي",
  ]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      let q = collection(firestore, "users");

      if (selectedEducationalStage) {
        q = query(q, where("edu_stage", "==", selectedEducationalStage));
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const studentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentsData);
      });

      return () => unsubscribe();
    };

    fetchStudents();
  }, [selectedEducationalStage]);

  const removeStudent = async (id) => {
    await deleteDoc(doc(firestore, "students", id));
  };

  return (
    <div className="student-manager">
      <h2>Manage Students</h2>
      <select
        value={selectedEducationalStage}
        onChange={(e) => setSelectedEducationalStage(e.target.value)}
      >
        <option value="">Select Educational Stage</option>
        {educationalStages.map((stage, index) => (
          <option key={index} value={stage}>
            {stage}
          </option>
        ))}
      </select>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} ({student.mobile}, {student.educationalStage})
            <button onClick={() => removeStudent(student.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentManager;
