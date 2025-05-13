import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allNames, setAllNames] = useState([]);

  const fetchNames = async () => {
    try {
      const res = await axios.get("http://localhost:8000/names/");
      const names = res.data.map((item) => item.name);
      setAllNames(names);
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
      setName(""); // reset input
      fetchNames(); // refresh list
    } catch (error) {
      console.error("Error submitting name:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
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
        {allNames.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
