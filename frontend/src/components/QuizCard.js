import React from 'react';

const QuizCard = ({ title }) => (
  <div className="quiz-card">
    <h3>{title}</h3>
    <button>Start Quiz</button>
  </div>
);

export default QuizCard;