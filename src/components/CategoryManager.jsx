import React, { useState, useEffect } from "react";
import "../styles/CategoryManager.css";
import { firestore } from "../config/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

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

  const addCategory = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    await addDoc(collection(firestore, "categories"), {
      title,
      image: imageUrl,
    });

    setTitle("");
    setImageUrl("");
    setError("");
  };

  const updateCategory = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (selectedCategory) {
      await updateDoc(doc(firestore, "categories", selectedCategory.id), {
        title,
        imageUrl,
      });

      setSelectedCategory(null);
      setTitle("");
      setImageUrl("");
      setError("");
    }
  };

  const removeCategory = async (id) => {
    await deleteDoc(doc(firestore, "categories", id));
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setTitle(category.title);
    setImageUrl(category.imageUrl);
  };

  return (
    <div className="category-manager">
      <h2>Manage Categories</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Category Title"
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL (optional)"
      />
      {error && <p className="error">{error}</p>}
      {selectedCategory ? (
        <button onClick={updateCategory}>Update Category</button>
      ) : (
        <button onClick={addCategory}>Add Category</button>
      )}
      <div className="categories-list">
        <h3>Categories</h3>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <div onClick={() => selectCategory(category)}>
                {category.title}
              </div>
              <button onClick={() => removeCategory(category.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManager;
