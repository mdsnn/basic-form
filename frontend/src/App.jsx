import { useState } from "react";
import axios from "axios";

export default function App() {
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await axios.post("http://localhost:8000/names/", { name });
      setSubmittedName(res.data.name);
      setName("");
    } catch (error) {
      console.error("Error submitting name:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        
      />
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
      <p>Saved name is: {submittedName}</p>
    </div>
  );
}
