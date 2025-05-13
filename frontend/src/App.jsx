import { useState } from "react";
import axios from "axios";

export default function App() {
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8000/names/", { name });
      setSubmittedName(res.data.name);
    } catch (error) {
      console.error("Error submitting name:", error);
    }
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
      <p>Saved name is: {submittedName}</p>
    </div>
  );
}
