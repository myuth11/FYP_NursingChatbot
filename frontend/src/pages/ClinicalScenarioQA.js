import React, { useState } from "react";

const ClinicalScenarioQA = ({ scenario }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const question = scenario.questions[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    if (showAnswer) return; // prevent re-selecting after answer shown
    setSelectedOption(option);
    setShowAnswer(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    if (currentQuestionIndex + 1 < scenario.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div>
      <h2>{scenario.title}</h2>
      <p><strong>{question.question}</strong></p>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {question.options.map((option) => (
          <li key={option} style={{ marginBottom: 8 }}>
            <button
              onClick={() => handleOptionSelect(option)}
              disabled={showAnswer}
              style={{
                padding: "8px 16px",
                width: "100%",
                textAlign: "left",
                backgroundColor:
                  showAnswer && option === question.answer
                    ? "#C8E6C9"
                    : showAnswer && option === selectedOption && option !== question.answer
                    ? "#FFCDD2"
                    : "white",
                border: "1px solid #0072CE",
                borderRadius: 8,
                cursor: showAnswer ? "default" : "pointer",
              }}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>

      {showAnswer && (
        <div style={{ marginTop: 16 }}>
          {selectedOption === question.answer ? (
            <p style={{ color: "green", fontWeight: "bold" }}>Correct!</p>
          ) : (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Incorrect. Correct answer: {question.answer}
            </p>
          )}

          {currentQuestionIndex + 1 < scenario.questions.length && (
            <button
              onClick={handleNext}
              style={{
                marginTop: 10,
                padding: "8px 16px",
                backgroundColor: "#0072CE",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Next Question
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClinicalScenarioQA;
