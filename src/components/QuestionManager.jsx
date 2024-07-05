import React, { useState, useEffect } from "react";
import "../styles/QuestionManager.css";
import { firestore } from "../config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const QuestionManager = () => {
  const [categories, setCategories] = useState([]);
  const [educationalStages, setEducationalStages] = useState([
    "الصف الاول الثانوي",
    "الصف الثاني الثانوي",
    "الصف الثالث الثانوي",
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedEducationalStage, setSelectedEducationalStage] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionImage, setQuestionImage] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);

  const getCollectionName = (educationalStage) => {
    switch (educationalStage) {
      case "الصف الاول الثانوي":
        return "sec1-quest";
      case "الصف الثاني الثانوي":
        return "sec2-quest";
      case "الصف الثالث الثانوي":
        return "sec3-quest";
      default:
        return "questions";
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const unsubscribe = onSnapshot(
        collection(firestore, "categories"),
        (snapshot) => {
          const categoriesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCategories(categoriesData);
        }
      );
      return () => unsubscribe();
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      const fetchQuestions = async () => {
        const q = query(
          collection(
            firestore,
            `categories/${selectedCategoryId}/${getCollectionName(
              selectedEducationalStage
            )}`
          )
        );

        let questionsData;
        const unsubscribe = onSnapshot(q, (snapshot) => {
          questionsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log(questionsData);
          setQuestions(questionsData);
        });
        return () => unsubscribe();
      };

      fetchQuestions();
    }
  }, [selectedCategoryId]);

  const addQuestion = async () => {
    if (
      !selectedCategoryId ||
      !selectedEducationalStage ||
      !questionText.trim() ||
      choices.some((choice) => !choice.trim())
    ) {
      setError("All fields are required");
      return;
    }

    const question = {
      questionText,
      image: questionImage,
      choices,
      correctAnswerIndex,
      educationalStage: selectedEducationalStage,
    };

    await addDoc(
      collection(
        firestore,
        `categories/${selectedCategoryId}/${getCollectionName(
          selectedEducationalStage
        )}`
      ),
      question
    );

    setQuestionText("");
    setChoices(["", "", "", ""]);
    setCorrectAnswerIndex(0);
    setError("");
  };

  const removeQuestion = async (id) => {
    await deleteDoc(
      doc(
        firestore,
        `categories/${selectedCategoryId}/${getCollectionName(
          selectedEducationalStage
        )}`,
        id
      )
    );
  };

  return (
    <div className="question-manager">
      <h2>Manage Questions</h2>
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
      <select
        value={selectedCategoryId}
        onChange={(e) => setSelectedCategoryId(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.title}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Question Text"
      />
      <input
        type="text"
        value={questionImage}
        onChange={(e) => setQuestionImage(e.target.value)}
        placeholder="Question image"
      />
      {choices.map((choice, index) => (
        <input
          key={index}
          type="text"
          value={choice}
          onChange={(e) => {
            const newChoices = [...choices];
            newChoices[index] = e.target.value;
            setChoices(newChoices);
          }}
          placeholder={`Choice ${index + 1}`}
        />
      ))}
      <select
        value={correctAnswerIndex}
        onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
      >
        {choices.map((_, index) => (
          <option key={index} value={index}>{`Choice ${index + 1}`}</option>
        ))}
      </select>
      {error && <p className="error">{error}</p>}
      <button onClick={addQuestion}>Add Question</button>
      <div className="questions-list">
        <h3>Questions</h3>
        <ul>
          {questions.map((question) => (
            <li key={question.id}>
              {question.questionText} ( {question.educationalStage})
              <ul>
                {question.choices.map((choice, index) => (
                  <li key={index}>
                    {choice}{" "}
                    {index === question.correctAnswerIndex ? "(Correct)" : ""}
                  </li>
                ))}
                <button onClick={() => removeQuestion(question.id)}>
                  Remove
                </button>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionManager;
