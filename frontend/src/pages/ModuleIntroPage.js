import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizProgress } from "../hooks/useQuizProgress";


const moduleData = [
  {
    title: "Milestones in Child Development (Infant to Adolescent)",
    description:
      "Gain an overview of how children grow and change from infancy to adolescence. Learn to identify key developmental milestones and understand how to support healthy growth at each stage",
    objectives: [
      "Describe key physical, cognitive, emotional, and social developmental milestones from infancy to adolescence",
      "Differentiate typical development patterns across various age groups",
      "Understand the role of environment, family, and culture in child development",
      "Apply developmental knowledge to support and guide children effectively at each stage",
    ],
    quizId: "0",
    materialsId: "0",
    image: "/InfanttoAdolescent.jpg",
  },
  {
    title: "Childhood Asthma: Triggers and Management",
    description:
      "Understand the common triggers of childhood asthma, recognize symptoms, and learn effective management strategies to improve quality of life and reduce asthma attacks.",
    objectives: [
      "Identify common asthma triggers in children such as allergens, exercise, and infections",
      "Recognize early signs and symptoms of asthma attacks",
      "Learn proper use of asthma medications including inhalers and spacers",
      "Understand strategies for asthma management and prevention of exacerbations",
    ],
    quizId: "1",
    materialsId: "1",
    image: "/Asthma.jpg",
  },
  {
    title: "Nutrition in Early Childhood",
    description:
      "Learn about essential nutritional needs during early childhood, common dietary challenges, and strategies to promote healthy growth and development.",
    objectives: [
      "Understand key nutrients required for healthy growth in young children",
      "Identify common nutritional issues such as picky eating and nutrient deficiencies",
      "Learn best practices for balanced meal planning and healthy eating habits",
      "Recognize the impact of nutrition on cognitive and physical development",
    ],
    quizId: "2",
    materialsId: "2",
    image: "/Nutrition.jpg",
  },
  {
    title: "Newborn Screening Tests and Interpretation",
    description:
      "Gain an understanding of the importance of newborn screening tests, the types of conditions they detect, and how to interpret screening results to ensure timely interventions and care",
    objectives: [
      "Understand the purpose and benefits of newborn screening programs",
      "Identify common conditions detected through newborn screening (e.g., metabolic, endocrine, hematologic disorders)",
      "Interpret basic newborn screening results and understand next steps after abnormal findings",
      "Recognize the role of early detection in improving long-term health outcomes",
    ],
    quizId: "3",
    materialsId: "3",
    image: "/Screening.jpg",
  },
  {
    title: "Poisoning in Children: First Aid and Prevention",
    description:
      "Learn about the common causes of poisoning in children, immediate first aid steps, and effective prevention strategies to safeguard children’s health and safety.",
    objectives: [
      "Identify common household and environmental poisoning hazards affecting children",
      "Understand the immediate first aid measures to take in cases of poisoning",
      "Recognize symptoms and signs of poisoning to enable timely intervention",
      "Implement prevention strategies to reduce the risk of poisoning in the home and community",
    ],
    quizId: "4",
    materialsId: "4",
    image: "/Poisoning.jpg",
  },
];

const ModuleIntroPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const moduleIndex = parseInt(id, 10);
  const module = moduleData[moduleIndex];

  // Get progress state & updater function from custom hook
  const { progress, updateProgress } = useQuizProgress();

  if (!module) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Module not found.
      </div>
    );
  }

  // Check if this module is completed
  const isCompleted = progress[moduleIndex] === "completed";

  // Toggle completion status when clicked
  const toggleCompletion = () => {
    if (isCompleted) {
      updateProgress(moduleIndex, "incomplete"); // or null/undefined depending on your implementation
    } else {
      updateProgress(moduleIndex, "completed");
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "3rem auto",
        backgroundColor: "#F9F9F9",
        borderRadius: 20,
        boxShadow: "0 10px 30px rgba(0, 114, 206, 0.12)",
        padding: "3rem 4rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#2E2E2E",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "1.5rem",
          backgroundColor: "#0072CE",
          color: "white",
          border: "none",
          padding: "0.6rem 1.2rem",
          borderRadius: 12,
          fontWeight: "600",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      {/* Title and toggle checkmark side by side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "700",
            color: "#0072CE",
            letterSpacing: "0.03em",
            margin: 0,
          }}
        >
          {module.title}
        </h1>

        {/* Checkmark toggle button */}
        <button
          onClick={toggleCompletion}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as completed"}
          title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
          style={{
            backgroundColor: isCompleted ? "#28a745" : "#6c757d", // green if completed, grey otherwise
            border: "none",
            borderRadius: "50%",
            width: 60,
            height: 60,
            cursor: "pointer",
            boxShadow: isCompleted
              ? "0 6px 20px rgba(40, 167, 69, 0.35)"
              : "0 6px 20px rgba(108, 117, 125, 0.35)",
            position: "relative",
            userSelect: "none",
            transition: "background-color 0.3s ease, transform 0.15s ease",
            flexShrink: 0,
            color: "white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isCompleted
              ? "#218838"
              : "#5a6268";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isCompleted
              ? "#28a745"
              : "#6c757d";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {isCompleted && (
            <span
              style={{
                display: "block",
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "14px",
                height: "28px",
                borderStyle: "solid",
                borderColor: "white",
                borderWidth: "0 5px 5px 0",
                transform: "translate(-50%, -60%) rotate(45deg)",
              }}
            />
          )}
        </button>
      </div>

      <div
        style={{
          width: "100%",
          height: 300,
          backgroundColor: "#E0F7FA",
          borderRadius: 16,
          margin: "1.5rem 0 3rem",
          overflow: "hidden",
          boxShadow: "inset 0 0 15px #B2EBF2",
        }}
      >
        <img
          src={module.image}
          alt={`${module.title} Visual`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <p
        style={{
          fontSize: "1.25rem",
          lineHeight: 1.7,
          marginBottom: "2.5rem",
        }}
      >
        {module.description}
      </p>

      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            color: "#0072CE",
            fontWeight: "700",
            marginBottom: "1rem",
            fontSize: "1.5rem",
          }}
        >
          Learning Objectives
        </h2>
        <ul
          style={{
            listStyleType: "disc",
            paddingLeft: "1.5rem",
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          {module.objectives.map((obj, i) => (
            <li key={i} style={{ marginBottom: "0.5rem" }}>
              {obj}
            </li>
          ))}
        </ul>
      </section>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.75rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        {[
          { label: "View Learning Resources", path: `/materials/${module.materialsId}` },
          { label: "Take a Quiz", path: `/quiz/${module.quizId}` },
        ].map(({ label, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            style={{
              backgroundColor: "#0072CE",
              color: "#F9F9F9",
              border: "none",
              padding: "1.15rem 3rem",
              borderRadius: 16,
              fontSize: "1.15rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(0, 114, 206, 0.35)",
              transition: "background-color 0.3s ease, transform 0.15s ease",
              minWidth: 160,
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#005bb5";
              e.currentTarget.style.transform = "scale(1.07)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0072CE";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModuleIntroPage;