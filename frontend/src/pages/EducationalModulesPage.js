import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useQuizProgress } from '../hooks/useQuizProgress';
import "../index.css";

const quizzes = [
  { title: "Milestones in Child Development", img: "/baby-girl.png" },
  { title: "Childhood Asthma: Triggers and Management", img: "/asthma.png" },
  { title: "Nutrition in Early Childhood", img: "/baby.png" },
  { title: "Newborn Screening Tests and Interpretation", img: "/health-check.png" },
  { title: "Poisoning in Children: First Aid and Prevention", img: "/first-aid-kit.png" },
];

const EducationalModulesPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { progress, updateProgress } = useQuizProgress();

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  const completed = Object.entries(progress).filter(([_, status]) => status === "completed");
  const inProgress = Object.entries(progress).filter(([_, status]) => status === "in-progress");
  const notStarted = quizzes.filter((_, idx) => !progress[idx]);

  return (
    <div className="chat-wrapper">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar-left">
        <div className="sidebar-header">
          <img src="/logo.jpg" alt="NurseAid" className="sidebar-logo" />
          <h2>NurseAid</h2>
        </div>
        <ul className="menu-list">
          <li onClick={() => navigate('/chat')}>💬 Chat</li>
          <li onClick={() => navigate('/protocols')}>📋 Clinical Protocols</li>
          <li onClick={() => navigate('/calculator')}>💧 Fluid Calculator</li>
          <li className="active" onClick={() => navigate('/modules')} style={{ backgroundColor: '#e6f0ff' }}>📚 Learning Modules</li>
        </ul>
        <div className="sidebar-footer-bottom">
          <ul className="menu-list">
            <li onClick={() => navigate('/help')}>❓ Help center</li>
            <li onClick={() => navigate('/settings')}>⚙️ Settings</li>
            <li onClick={() => { logout(); navigate('/'); }}>🚪 Logout</li>
          </ul>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="chat-main">
        <div className="chat-message-area">
          <div className="educational-page">
            <h2 className="edu-title">Educational Modules</h2>

            <div className="search-container">
              <input
                type="text"
                className="edu-search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearch("");
                }}
              />
            </div>

            <div className="edu-quizzes">
              {filteredQuizzes.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "2rem", color: "#888" }}>
                  No quizzes found for "{search}"
                </div>
              ) : (
                filteredQuizzes.map((quiz, idx) => (
                  <div key={idx} className="quiz-card">
                    <div className="quiz-title">{quiz.title}</div>
                    {quiz.img && <img src={quiz.img} alt={quiz.title} className="quiz-img" />}
                    <div className="quiz-status">
                      Status: {progress[idx] || "Not Started"}
                    </div>
                    <button
                      className="start-learning-btn"
                      onClick={() => {
                        updateProgress(idx, "in-progress");
                        navigate(`/modules/intro/${idx}`);
                      }}
                    >
                      Start Learning
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="sidebar-right">
        <h4>Learning Progress</h4>
        <ul className="chat-history">
          <li className="history-item">
            <strong>Completed:</strong>{" "}
            {completed.length > 0
              ? completed.map(([idx]) => quizzes[idx]?.title).join(", ")
              : "None"}
          </li>
          <li className="history-item">
            <strong>In Progress:</strong>{" "}
            {inProgress.length > 0
              ? inProgress.map(([idx]) => quizzes[idx]?.title).join(", ")
              : "None"}
          </li>
          <li className="history-item">
            <strong>Not Started:</strong>{" "}
            {notStarted.length > 0
              ? notStarted.map((quiz) => quiz.title).join(", ")
              : "None"}
          </li>
          <li className="history-item">
            <strong>Total Modules:</strong> {quizzes.length} available
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default EducationalModulesPage;
