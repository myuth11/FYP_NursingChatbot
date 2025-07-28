import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const FlashcardReview = ({ flashcards = [], onRestart }) => {
  const { id: quizId } = useParams(); // Get quizId from URL params
  const navigate = useNavigate();

  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (flashcards.length === 0) {
    return (
      <div style={{ padding: 20, fontSize: 18, textAlign: "center" }}>
        No flashcards to review.
      </div>
    );
  }

  const card = flashcards[currentCard];

  const isNonEmptyString = (value) =>
    typeof value === "string" && value.trim().length > 0;

  const hasExplanation = isNonEmptyString(card.explanation);
  const hasAnswer = isNonEmptyString(card.answer);

  const handleNext = () => {
    setFlipped(false);
    if (currentCard < flashcards.length - 1) setCurrentCard(currentCard + 1);
  };

  const handlePrev = () => {
    setFlipped(false);
    if (currentCard > 0) setCurrentCard(currentCard - 1);
  };

  const handleRestart = () => {
    setCurrentCard(0);
    setFlipped(false);
    if (onRestart) onRestart();
  };

const handleBack = () => {
  navigate(`/modules`);
};


  const styles = {
    container: {
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "40px 20px",
      boxSizing: "border-box",
      background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
      color: "#1b2a41",
    },
    progressBarContainer: {
      width: "100%",
      maxWidth: 480,
      height: 10,
      borderRadius: 10,
      backgroundColor: "#e0e0e0",
      overflow: "hidden",
      marginBottom: 30,
      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: "#4a90e2",
      transition: "width 0.3s ease",
      width: `${((currentCard + 1) / flashcards.length) * 100}%`,
      borderRadius: 10,
      boxShadow: "0 2px 8px rgba(74, 144, 226, 0.6)",
    },
    cardContainer: {
      height: 320,
      width: "90vw",
      maxWidth: 480,
      borderRadius: 16,
      boxShadow:
        "0 12px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
      cursor: "pointer",
      perspective: 1400,
      position: "relative",
      userSelect: "none",
      backgroundColor: "transparent",
      marginBottom: 40,
    },
    cardInner: {
      position: "relative",
      width: "100%",
      height: "100%",
      borderRadius: 16,
      transition: "transform 0.6s ease-in-out",
      transformStyle: "preserve-3d",
      transform: flipped ? "rotateY(180deg)" : "none",
    },
    cardFaceFront: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "#4a90e2",
      color: "white",
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 30,
      fontWeight: "700",
      padding: 30,
      backfaceVisibility: "hidden",
      textAlign: "center",
      boxShadow: "inset 0 0 40px rgba(255,255,255,0.3)",
      lineHeight: 1.3,
      userSelect: "none",
    },
    cardFaceBack: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "#f5f7fa",
      color: "#1b2a41",
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 26,
      fontWeight: "600",
      padding: 30,
      backfaceVisibility: "hidden",
      textAlign: "center",
      boxShadow: "inset 0 0 30px rgba(0,0,0,0.05)",
      transform: "rotateY(180deg)",
      lineHeight: 1.4,
      userSelect: "none",
    },
    navContainer: {
      width: "100%",
      maxWidth: 480,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 15,
      marginBottom: 15,
    },
    navButton: (disabled) => ({
      flex: "1 1 0",
      padding: "12px 0",
      fontSize: 18,
      borderRadius: 10,
      border: "1.5px solid #4a90e2",
      backgroundColor: disabled ? "#d3dbe6" : "#4a90e2",
      color: disabled ? "#7a8ba6" : "white",
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled
        ? "none"
        : "0 6px 12px rgba(74, 144, 226, 0.5)",
      transition: "background-color 0.3s ease",
      userSelect: "none",
    }),
    navCount: {
      flex: "0 0 auto",
      fontWeight: "700",
      fontSize: 18,
      minWidth: 60,
      textAlign: "center",
      color: "#334e68",
    },
    restartContainer: {
      width: "100%",
      maxWidth: 480,
      textAlign: "center",
      marginBottom: 20,
    },
    restartButton: {
      width: "100%",
      backgroundColor: "#f45b69",
      color: "white",
      border: "none",
      padding: "14px 0",
      borderRadius: 12,
      fontSize: 18,
      cursor: "pointer",
      userSelect: "none",
      boxShadow: "0 6px 14px rgba(244, 91, 105, 0.6)",
      transition: "background-color 0.3s ease",
    },
    backButton: {
      position: "relative",
      zIndex: 1000,
      width: "100%",
      maxWidth: 480,
      padding: "14px 0",
      borderRadius: 12,
      fontSize: 18,
      cursor: "pointer",
      userSelect: "none",
      backgroundColor: "#4a90e2",
      color: "white",
      border: "none",
      boxShadow: "0 6px 14px rgba(74, 144, 226, 0.6)",
      transition: "background-color 0.3s ease",
      marginBottom: 10,
    },
  };

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button
        onClick={handleBack}
        style={styles.backButton}
        aria-label="Back to Quiz Review"
      >
        ← Back to Learning Modules
      </button>

      {/* Progress Bar */}
      <div style={styles.progressBarContainer}>
        <div style={styles.progressBarFill} />
      </div>

      {/* Flashcard */}
      <div
        style={styles.cardContainer}
        onClick={() => setFlipped(!flipped)}
        role="button"
        tabIndex={0}
        aria-label="Flashcard, click to flip"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setFlipped(!flipped);
            e.preventDefault();
          }
        }}
      >
        <div style={styles.cardInner}>
          <div style={styles.cardFaceFront}>{card.question}</div>
          <div style={styles.cardFaceBack}>
            {hasExplanation
              ? card.explanation
              : hasAnswer
              ? card.answer
              : "No explanation available"}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.navContainer}>
        <button
          onClick={handlePrev}
          disabled={currentCard === 0}
          style={styles.navButton(currentCard === 0)}
          aria-label="Previous card"
        >
          ← Previous
        </button>

        <span style={styles.navCount}>
          {currentCard + 1} / {flashcards.length}
        </span>

        <button
          onClick={handleNext}
          disabled={currentCard === flashcards.length - 1}
          style={styles.navButton(currentCard === flashcards.length - 1)}
          aria-label="Next card"
        >
          Next →
        </button>
      </div>

      {/* Restart */}
      <div style={styles.restartContainer}>
        <button onClick={handleRestart} style={styles.restartButton}>
          Restart Quiz
        </button>
      </div>
    </div>
  );
};

export default FlashcardReview;
