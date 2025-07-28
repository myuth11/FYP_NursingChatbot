import { useState, useEffect } from "react";

export const useQuizProgress = () => {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("quizProgress");
    if (stored) {
      setProgress(JSON.parse(stored));
    }
  }, []);

  const updateProgress = (id, status) => {
    const newProgress = { ...progress, [id]: status };
    setProgress(newProgress);
    localStorage.setItem("quizProgress", JSON.stringify(newProgress));
  };

  return { progress, updateProgress };
};
