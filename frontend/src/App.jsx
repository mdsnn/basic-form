import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allNames, setAllNames] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

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
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your name"
      />
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {submittedName && <p>Saved name is: {submittedName}</p>}

      <h3>All Submitted Names:</h3>
      <ul>
        {allNames.map((n) => (
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
              <span onClick={() => handleEdit(n.id, n.name)} style={{ cursor: "pointer" }}>
                {n.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
