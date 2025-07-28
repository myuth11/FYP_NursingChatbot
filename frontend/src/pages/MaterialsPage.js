import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const materialsData = [
  {
    id: "0",
    title: "Developmental Milestones in Childhood: Learning Resources",
    description:
      "Explore comprehensive learning resources on developmental milestones, including clinical guidelines, checklists, tutorials, and case studies to support ongoing education in child development.",
    guidelines: [
      {
        title: "Milestone Moments: CDC Developmental Milestone Guide (Birth to 5 Years).",
        url: "/MilestoneGuidelines.pdf",
        fileType: "pdf",
      },
    ],
    checklists: [
      {
        title: "Developmental Milestones Checklist: Birth to 5 Years",
        url: "/MilestoneChecklist.pdf",
        fileType: "pdf",
      },
    ],
    sops: [
      {
        title: "SOP for Conducting Developmental Assessments",
        url: "/MilestoneSOP.pdf",
        fileType: "pdf",
      },
    ],
    videos: [
      {
        folderTitle: "Developmental Milestones Video",
        videos: [
          {
            title: "Developmental Milestones Overview",
            url: "https://www.youtube.com/embed/g4HdXxz25pw?si=xQzOop-W97_7Ir1i",
          },
        ],
      },
    ],
    clinicalScenarios: [
      {
        id: "cs1",
        title: "Delayed Speech Development Scenario",
        questions: [
          {
            question: "What is the first step in managing a child with delayed speech?",
            options: [
              "Wait 6 months and observe",
              "Refer to speech therapy",
              "Order a hearing test",
              "Start antibiotics",
            ],
            answer: "Refer to speech therapy",
          },
          // ... additional questions here
        ],
      },
    ],
  },
  {
    id: "1",
    title: "Childhood Asthma: Learning Resources",
    description:
      "Educational materials focused on recognizing, managing, and preventing asthma attacks in children.",
    guidelines: [
      {
        title: "Asthma Management Guidelines",
        url: "/AsthmaGuidelines.pdf",
        fileType: "pdf",
      },
    ],
    checklists: [
      {
        title: "Asthma Action Plan Checklist",
        url: "/AsthmaChecklist.pdf",
        fileType: "pdf",
      },
    ],
    sops: [
      {
        title: "SOP for Acute Asthma Management",
        url: "/AsthmaSOP.pdf",
        fileType: "pdf",
      },
    ],
    videos: [
      {
        folderTitle: "Understanding Childhood Asthma",
        videos: [
          {
            title: "Understanding Childhood Asthma",
            url: "https://www.youtube.com/embed/soiSC8acvjE?si=sz-9ZZGlUyN2STTK",
          },
        ],
      },
    ],
    clinicalScenarios: [
      {
        id: "cs2",
        title: "Asthma Attack Scenario",
        questions: [
          {
            question: "What is the immediate treatment for a severe asthma attack?",
            options: [
              "Administer inhaled bronchodilators",
              "Give oral antibiotics",
              "Order a chest X-ray",
              "Start physical therapy",
            ],
            answer: "Administer inhaled bronchodilators",
          },
          // ... additional questions here
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Nutrition in Early Childhood",
    description:
      "Resources on optimal nutrition practices for infants and toddlers to support healthy growth.",
    guidelines: [
      {
        title: "Nutritional Guidelines for Early Childhood",
        url: "/NutritionGuidelines.pdf",
        fileType: "pdf",
      },
    ],
    checklists: [
      {
        title: "Daily Nutrition Checklist",
        url: "/NutritionChecklist.pdf",
        fileType: "pdf",
      },
    ],
    sops: [],
    videos: [
      {
        folderTitle: "Nutrition in Early Childhood",
        videos: [
          {
            title: "Nutrition in Early Childhood",
            url: "https://www.youtube.com/embed/4bUPl-qPg38?si=DAiFRKm6eQ98-2-3",
          },
        ],
      },
    ],
    clinicalScenarios: [
      {
        id: "cs3",
        title: "Nutrition Deficiency Scenario",
        questions: [
          {
            question: "What is a common sign of iron deficiency in toddlers?",
            options: [
              "Fatigue and pallor",
              "Increased appetite",
              "Weight gain",
              "Hyperactivity",
            ],
            answer: "Fatigue and pallor",
          },
          // ... additional questions here
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Newborn Screening Tests and Interpretation",
    description:
      "Learning resources covering newborn screening procedures and interpretation of results.",
    guidelines: [
      {
        title: "Newborn Screening Protocols",
        url: "/ScreeningGuidelines.pdf",
        fileType: "pdf",
      },
    ],
    checklists: [
      {
        title: "Newborn Screening Checklist",
        url: "/ScreeningChecklist.pdf",
        fileType: "pdf",
      },
    ],
    sops: [
      {
        title: "SOP for Newborn Screening Procedures",
        url: "/ScreeningSOP.pdf",
        fileType: "pdf",
      },
    ],
    videos: [
      {
        folderTitle: "Newborn Screening Tests and Interpretation",
        videos: [
          {
            title: "Introduction to Newborn Screening",
            url: "https://www.youtube.com/embed/1WOZ07NISbw?si=bSxQEgq25JJb6_1s",
          },
        ],
      },
    ],
    clinicalScenarios: [
      {
        id: "cs4",
        title: "Abnormal Screening Result Scenario",
        questions: [
          {
            question: "What is the next step if a newborn screening test is abnormal?",
            options: [
              "Refer for confirmatory testing",
              "Ignore and retest in 1 year",
              "Start immediate treatment",
              "Schedule vaccination",
            ],
            answer: "Refer for confirmatory testing",
          },
          // ... additional questions here
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Poisoning in Children: First Aid and Prevention",
    description:
      "Guidelines and resources on preventing and managing poisoning incidents in children.",
    guidelines: [
      {
        title: "Poisoning Prevention Guidelines",
        url: "/PoisoningGuidelines.pdf",
        fileType: "pdf",
      },
    ],
    checklists: [
      {
        title: "Poisoning First Aid Checklist",
        url: "/PoisoningChecklist.pdf",
        fileType: "pdf",
      },
    ],
    sops: [
      {
        title: "SOP for Managing Poisoning Incidents",
        url: "/PoisoningSOP.pdf",
        fileType: "pdf",
      }
    ],
    videos: [
      {
        folderTitle: "Poisoning Prevention and Management",
        videos: [
          {
            title: "Poisoning Prevention and Management",
            url: "https://www.youtube.com/embed/hMWsDZ1ikD8?si=BDboJpOKsb2dQIIs",
          },
          {
            title: "How To Treat Poisoning, Signs & Symptoms",
            url: "https://www.youtube.com/embed/b2ieb8BZJuY?si=hS7vrHn57Qoh4QZF",
          },
        ],
      },
    ],
    clinicalScenarios: [
      {
        id: "cs5",
        title: "Poisoning Incident Scenario",
        questions: [
          {
            question: "What is the first action to take when a child is suspected of poisoning?",
            options: [
              "Call emergency services immediately",
              "Induce vomiting",
              "Give milk or water",
              "Wait and observe",
            ],
            answer: "Call emergency services immediately",
          },
          // ... additional questions here
        ],
      },
    ],
  },
];

const categoriesList = [
  { key: "all", label: "All" },
  { key: "guidelines", label: "Clinical Guidelines" },
  { key: "checklists", label: "Checklists" },
  { key: "sops", label: "SOPs" },
  { key: "videos", label: "Educational Videos" },
  { key: "clinicalScenarios", label: "Clinical Scenarios" },
];

const styles = {
  page: {
    maxWidth: 900,
    margin: "3rem auto",
    backgroundColor: "#F9F9F9",
    borderRadius: 20,
    boxShadow: "0 10px 30px rgba(0, 114, 206, 0.12)",
    padding: "3rem 4rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#2E2E2E",
  },
  backButton: {
    backgroundColor: "#0072CE",
    color: "#F9F9F9",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: 12,
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "2rem",
    boxShadow: "0 4px 12px rgba(0,114,206,0.3)",
    transition: "background-color 0.3s ease",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#0072CE",
    letterSpacing: "0.02em",
  },
  description: {
    fontSize: "1.25rem",
    marginBottom: "2rem",
    color: "#2E2E2E",
  },
  tabs: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
    userSelect: "none",
  },
  searchInput: {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "1.1rem",
    borderRadius: 12,
    border: "1.5px solid #0072CE",
    marginBottom: "3rem",
    outline: "none",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: "1.5rem 2rem",
    marginBottom: "2rem",
    boxShadow: "0 6px 18px rgba(0, 114, 206, 0.12)",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0072CE",
    marginBottom: "1rem",
    borderBottom: "2px solid #0072CE",
    paddingBottom: "0.3rem",
  },
  buttonLink: {
    display: "inline-block",
    padding: "0.5rem 1rem",
    backgroundColor: "#0072CE",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "0.95rem",
    marginTop: "0.4rem",
    transition: "background-color 0.3s",
  },
  folderTitle: {
    color: "#005bb5",
    marginBottom: "1rem",
    fontSize: "1.25rem",
    fontWeight: "600",
  },
};

const VideosSection = ({ videoFolders, searchTerm }) => (
  <section style={styles.section}>
    <h2 style={styles.sectionTitle}>Educational Video</h2>
    {videoFolders.map((folder, idx) => {
      const filteredVideos = folder.videos.filter((vid) =>
        vid.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredVideos.length === 0) return null;

      return (
        <div key={idx} style={{ marginBottom: "2rem" }}>
          <h3 style={styles.folderTitle}>{folder.folderTitle}</h3>
          {filteredVideos.map((vid, i) => {
            const isYouTube =
              vid.url.includes("youtube.com") || vid.url.includes("youtu.be");
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  paddingBottom: "56.25%", // 16:9 aspect ratio
                  paddingTop: 25,
                  height: 0,
                  marginBottom: "1.5rem",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 6px 20px rgba(0, 114, 206, 0.15)",
                }}
              >
                {isYouTube ? (
                  <iframe
                    src={vid.url}
                    title={vid.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: 12,
                    }}
                  />
                ) : (
                  <video
                    controls
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: 12,
                      backgroundColor: "#000",
                    }}
                  >
                    <source src={vid.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            );
          })}
        </div>
      );
    })}
  </section>
);

const MaterialsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const material = materialsData.find((mat) => mat.id === id);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (!material) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Materials not found.
      </div>
    );
  }

  const filterBySearch = (items) =>
    items.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const hasItems = (key) => {
    if (key === "all") return true;
    if (key === "videos") {
      return material.videos.some((folder) =>
        folder.videos.some((vid) =>
          vid.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (key === "clinicalScenarios") {
      return (material.clinicalScenarios || []).some((scenario) =>
        scenario.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return (material[key] || []).some((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderDownloadLink = (item) => (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      download
      style={styles.buttonLink}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0072CE")}
    >
      Download {item.fileType?.toUpperCase() || "File"}
    </a>
  );

  const renderCategorySection = (key, label) => {
    if (key === "videos") {
      const filteredFolders = material.videos
        .map((folder) => ({
          ...folder,
          videos: folder.videos.filter((vid) =>
            vid.title.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((folder) => folder.videos.length > 0);

      if (filteredFolders.length === 0) {
        return (
          <section key={key} style={styles.section}>
            <h2 style={styles.sectionTitle}>{label}</h2>
            <p>No videos found matching your search.</p>
          </section>
        );
      }

      return <VideosSection videoFolders={filteredFolders} searchTerm={searchTerm} />;
    }

    if (key === "clinicalScenarios") {
      if (!hasItems(key)) {
        return (
          <section key={key} style={styles.section}>
            <h2 style={styles.sectionTitle}>{label}</h2>
            <p>No clinical scenarios found matching your search.</p>
          </section>
        );
      }
      // Link to the clinical scenarios page instead of listing here
      return (
        <section key={key} style={styles.section}>
          <h2 style={styles.sectionTitle}>{label}</h2>
          <Link
            to={`/materials/${material.id}/clinical-scenarios`}
            style={styles.buttonLink}
          >
            View Clinical Scenarios
          </Link>
        </section>
      );
    }

    // For guidelines, checklists, sops, etc.
    const items = filterBySearch(material[key] || []);
    if (items.length === 0) {
      return (
        <section key={key} style={styles.section}>
          <h2 style={styles.sectionTitle}>{label}</h2>
          <p>No {label.toLowerCase()} found matching your search.</p>
        </section>
      );
    }

    return (
      <section key={key} style={styles.section}>
        <h2 style={styles.sectionTitle}>{label}</h2>
        {items.map((item, i) => (
          <div key={i} style={{ marginBottom: "1rem" }}>
            <div style={{ marginBottom: "0.25rem", fontWeight: 600 }}>{item.title}</div>
            {renderDownloadLink(item)}
          </div>
        ))}
      </section>
    );
  };

  return (
    <div style={styles.page}>
      <button
        onClick={() => navigate("/modules")}  // <- directs back to /modules explicitly
        style={styles.backButton}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0072CE")}
      >
        ← Back
      </button>

      <h1 style={styles.title}>{material.title}</h1>
      <p style={styles.description}>{material.description}</p>

      <div style={styles.tabs}>
        {categoriesList.map(({ key, label }) => {
          const isActive = key === selectedCategory;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: 20,
                border: isActive ? "2px solid #0072CE" : "2px solid transparent",
                backgroundColor: isActive ? "#E0F7FA" : "transparent",
                color: isActive ? "#0072CE" : "#555",
                fontWeight: isActive ? "700" : "600",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <input
        type="text"
        placeholder="Search resources..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      {selectedCategory === "all"
        ? categoriesList
            .filter((cat) => cat.key !== "all" && hasItems(cat.key))
            .map((cat) => renderCategorySection(cat.key, cat.label))
        : renderCategorySection(
            selectedCategory,
            categoriesList.find((cat) => cat.key === selectedCategory)?.label
          )}
    </div>
  );
};

export default MaterialsPage;
