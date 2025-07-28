import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizData from "../data/quizData";
import FlashcardReview from "../components/FlashcardReview";

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const questions = quizData.filter((q) => q.quizId === id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setAnswers({});
    setQuizComplete(false);
    setReviewMode(false);
  }, [id]);

  if (questions.length === 0) {
    return (
      <div style={{ padding: 20, fontSize: 18, textAlign: "center" }}>
        No questions found for this quiz.
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentIndex] ?? null;

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setQuizComplete(false);
    setReviewMode(false);
  };

  const startFlashcardReview = () => {
    setReviewMode(true);
  };

  const styles = {
    container: {
      maxWidth: 720,
      margin: "3rem auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#fff",
      borderRadius: 12,
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      padding: "2.5rem 3rem",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
    },
    backButton: {
      marginBottom: "1.5rem",
      padding: "8px 20px",
      fontSize: 16,
      borderRadius: 8,
      border: "none",
      backgroundColor: "#999",
      color: "white",
      cursor: "pointer",
      userSelect: "none",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      alignSelf: "flex-start",
    },
    questionNumber: {
      color: "#0072CE",
      fontWeight: "600",
      marginBottom: "1rem",
    },
    questionHeader: {
      fontSize: 24,
      fontWeight: "700",
      color: "#0d1b2a",
      marginBottom: "0.5rem",
    },
    optionsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    optionButton: (selected, disabled) => ({
      padding: "14px 24px",
      borderRadius: 10,
      fontSize: 18,
      fontWeight: "600",
      cursor: disabled ? "default" : "pointer",
      border: selected ? "2px solid #0072CE" : "2px solid transparent",
      backgroundColor: selected ? "#0072CE" : "#f0f4f8",
      color: selected ? "white" : "#0d1b2a",
      boxShadow: selected ? "0 4px 12px rgba(0, 114, 206, 0.5)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
      transition: "background-color 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
      userSelect: "none",
      textAlign: "left",
    }),
    navButtonsContainer: {
      display: "flex",
      gap: "1rem",
      marginTop: "1rem",
    },
    navButton: {
      padding: "12px 30px",
      fontSize: 18,
      fontWeight: "700",
      borderRadius: 10,
      border: "none",
      backgroundColor: "#0072CE",
      color: "white",
      cursor: "pointer",
      userSelect: "none",
      boxShadow: "0 6px 14px rgba(0, 114, 206, 0.6)",
      transition: "background-color 0.3s ease",
      flexGrow: 1,
    },
    reviewContainer: {
      maxWidth: 720,
      margin: "3rem auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#fff",
      borderRadius: 12,
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      padding: "2.5rem 3rem",
    },
    reviewItem: {
      marginBottom: "1.5rem",
      padding: "1rem 1.5rem",
      borderRadius: 8,
      backgroundColor: "#f0f4f8",
      boxShadow: "inset 0 0 5px rgba(0,0,0,0.05)",
    },
    correctAnswer: {
      color: "#4caf50",
      fontWeight: "700",
    },
    wrongAnswer: {
      color: "#f44336",
      fontWeight: "700",
    },
    reviewButtons: {
      marginTop: "2rem",
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
    },
    reviewButton: {
      padding: "12px 30px",
      fontSize: 18,
      fontWeight: "700",
      borderRadius: 10,
      border: "none",
      backgroundColor: "#0072CE",
      color: "white",
      cursor: "pointer",
      userSelect: "none",
      boxShadow: "0 6px 14px rgba(0, 114, 206, 0.6)",
      transition: "background-color 0.3s ease",
      flexGrow: 1,
      maxWidth: 200,
    },
  };

  // Calculate score:
  const score = Object.entries(answers).reduce((acc, [index, ans]) => {
    return questions[index].answer === ans ? acc + 1 : acc;
  }, 0);

  if (quizComplete && reviewMode) {
    // Show Flashcard Review
    return (
      <FlashcardReview
        flashcards={questions.map((q) => ({
          question: q.question,
          explanation: q.answer,
        }))}
        onRestart={restartQuiz}
      />
    );
  }

  if (quizComplete) {
    // Show Review Page
    return (
      <main style={styles.reviewContainer}>
        <button
          onClick={() => navigate("/modules")}
          style={styles.backButton}
          aria-label="Back to modules"
        >
          ← Back to Modules
        </button>

        <h2 style={{ marginBottom: "1.5rem", color: "#0d1b2a" }}>
          Quiz Review — Your Score: {score} / {questions.length}
        </h2>

        {questions.map((q, i) => {
          const userAns = answers[i];
          const isCorrect = userAns === q.answer;
          return (
            <div key={q.id} style={styles.reviewItem}>
              <div style={{ fontWeight: "700", marginBottom: "0.25rem" }}>
                Q{i + 1}: {q.question}
              </div>
              <div>
                Your answer:{" "}
                <span style={isCorrect ? styles.correctAnswer : styles.wrongAnswer}>
                  {String(userAns)}
                </span>
              </div>
              {!isCorrect && (
                <div>
                  Correct answer: <span style={styles.correctAnswer}>{String(q.answer)}</span>
                </div>
              )}
            </div>
          );
        })}

        <div style={styles.reviewButtons}>
          <button onClick={restartQuiz} style={styles.reviewButton}>
            Take Quiz Again
          </button>
          <button onClick={startFlashcardReview} style={styles.reviewButton}>
            Study with Flashcards
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.container} role="main" aria-labelledby="question-title">
      <button
        onClick={() => navigate("/modules")}
        style={styles.backButton}
        aria-label="Back to modules"
      >
        ← Back to Modules
      </button>

      <div style={styles.questionNumber}>
        Question {currentIndex + 1} of {questions.length}
      </div>

      <h2 id="question-title" style={styles.questionHeader}>
        {currentQuestion.question}
      </h2>

      {/* Multiple Choice */}
      {currentQuestion.type === "mcq" && (
        <div style={styles.optionsContainer} role="list" aria-label="Answer choices">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const disabled = false; 


            return (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                disabled={disabled}
                style={styles.optionButton(isSelected, disabled)}
                aria-pressed={isSelected}
                role="listitem"
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* True/False */}
      {currentQuestion.type === "truefalse" && (
        <div
          style={{ ...styles.optionsContainer, flexDirection: "row", justifyContent: "center", gap: 30 }}
          role="list"
          aria-label="True or False choices"
        >
          {[true, false].map((val) => {
            const isSelected = selectedAnswer === val;
            const disabled = selectedAnswer !== null;

            return (
              <button
                key={val.toString()}
                onClick={() => handleAnswer(val)}
                disabled={disabled}
                style={styles.optionButton(isSelected, disabled)}
                aria-pressed={isSelected}
                
              >
                {val ? "True" : "False"}
              </button>
            );
          })}
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={styles.navButtonsContainer}>
        <button
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          style={{
            ...styles.navButton,
            backgroundColor: currentIndex === 0 ? "#ccc" : "#0072CE",
            cursor: currentIndex === 0 ? "default" : "pointer",
          }}
          aria-label="Previous Question"
        >
          ◀ Previous
        </button>

        <button
          onClick={nextQuestion}
          disabled={selectedAnswer === null}
          style={{
            ...styles.navButton,
            backgroundColor: selectedAnswer === null ? "#ccc" : "#0072CE",
            cursor: selectedAnswer === null ? "default" : "pointer",
          }}
          aria-label={currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
        >
          {currentIndex < questions.length - 1 ? "Next Question ▶" : "Finish Quiz"}
        </button>
      </div>
    </main>
  );
};

export default QuizPage;
