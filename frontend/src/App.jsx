import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // You'll define styles here

export default function App() {
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allNames, setAllNames] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNames = async () => {
    try {
      const res = await axios.get("http://localhost:8000/names/");
      setAllNames(res.data);
    } catch (err) {
      console.error("Failed to fetch names", err);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:8000/names/", { name });
      setSubmittedName(res.data.name);
      setName("");
      fetchNames();
    } catch (error) {
      console.error("Error submitting name:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (id, value) => {
    setEditingId(id);
    setEditingValue(value);
  };

  const saveEdit = async (id) => {
    if (!editingValue.trim()) return;

    try {
      await axios.put(`http://localhost:8000/names/${id}`, { name: editingValue });
      setEditingId(null);
      setEditingValue("");
      fetchNames();
    } catch (err) {
      console.error("Failed to update name", err);
    }
  };

  const deleteName = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/names/${id}`);
      fetchNames();
    } catch (err) {
      console.error("Failed to delete name", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === "Enter") {
      saveEdit(id);
    }
  };

  useEffect(() => {
    fetchNames();
  }, []);

  return (
    <div className="app">
      <h2>Simple Name Saver</h2>

      <div className="form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your name"
        />
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {submittedName && <p className="success">Saved: {submittedName}</p>}

      <h3>Submitted Names:</h3>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search names..."
        className="search"
      />
      <ul className="name-list">
        {allNames
        .filter((n) => n.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((n) => (
          <li key={n.id}>
           {editingId === n.id ? (
            <input
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={(e) => handleEditKeyDown(e, n.id)}
              onBlur={() => saveEdit(n.id)}
              autoFocus
            />
          ) : (
            <span className="name-text" onClick={() => handleEdit(n.id, n.name)}>
              {n.name}
            </span>
          )}
          <button className="delete-btn" onClick={() => deleteName(n.id)}>
          ❌
          </button>
        </li>
      ))}
    </ul>
    </div>
  );
}
