import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const scenariosByMaterial = {
  "0": {
    title: "Clinical Scenarios: Developmental Milestones",
    steps: [
      {
        id: "scenario1",
        image: "/CSMilestone1.jpg",
        paragraph:
          "A mother brings her 3-year-old child to your clinic. She says her child doesn’t say more than 10 words and struggles to form simple sentences. The child is otherwise active and interacts normally during play.",
        question: "What is the most appropriate first step in management?",
        options: [
          "Wait 6 months and observe",
          "Refer to speech therapy",
          "Order an MRI",
          "Prescribe antibiotics",
        ],
        answer: "Refer to speech therapy",
        justification:
          "Early referral to speech therapy helps address language delays promptly, improving communication outcomes. Waiting or unrelated investigations like MRI are not appropriate first steps here.",
      },
      {
        id: "scenario2",
        image: "/CSMilestone2.jpg",
        paragraph:
          "During a routine 6-month checkup, you observe that the baby doesn’t smile at you or react much to your facial expressions. The parents mention that she rarely smiles or looks at others’ faces.",
        question: "What developmental concern should be prioritized?",
        options: [
          "Motor delay",
          "Social-emotional delay",
          "Normal behavior for age",
          "Visual impairment",
        ],
        answer: "Social-emotional delay",
        justification:
          "Lack of smiling and poor social interaction at 6 months indicates possible social-emotional developmental delays that should be evaluated early.",
      },
      {
        id: "scenario3",
        image: "/CSMilestone3.jpg",
        paragraph:
          "At a health visit, a father expresses concern that his 18-month-old has not started walking independently yet. The child crawls well and can pull to stand.",
        question: "What is the next best step?",
        options: [
          "Reassure and follow up in 6 months",
          "Refer for developmental assessment",
          "Order brain MRI immediately",
          "Begin speech therapy",
        ],
        answer: "Refer for developmental assessment",
        justification:
          "Delayed independent walking warrants a developmental assessment to identify any underlying issues early. Immediate MRI or speech therapy is not first-line here.",
      },
      {
        id: "scenario4",
        image: "/CSMilestone4.jpg",
        paragraph:
          "A 2-year-old girl is brought in by her parents who are concerned she doesn’t always respond when her name is called. They also notice she prefers to play alone and repeats words rather than using them meaningfully.",
        question: "What condition should be evaluated for?",
        options: [
          "Hearing impairment",
          "Autism Spectrum Disorder",
          "ADHD",
          "Vision loss",
        ],
        answer: "Autism Spectrum Disorder",
        justification:
          "These behaviors are characteristic signs of Autism Spectrum Disorder and warrant further evaluation.",
      },
      {
        id: "scenario5",
        image: "/CSMilestone5.jpg",
        paragraph:
          "A preschool teacher shares that a 4-year-old boy has difficulty interacting with peers and often hits when upset. At home, he throws tantrums and doesn't express feelings verbally.",
        question: "What milestone category does this behavior suggest challenges in?",
        options: ["Language", "Physical", "Social/Emotional", "Cognitive"],
        answer: "Social/Emotional",
        justification:
          "Difficulty interacting, expressing emotions, and behavioral issues suggest challenges in social and emotional development.",
      },
    ],
  },
  "1": {
    title: "Clinical Scenarios: Asthma Triggers and Management",
    steps: [
      {
        id: "asthma_scenario1",
        image: "/CSAsthma1.jpg",
        paragraph:
          "A 7-year-old child with asthma frequently experiences coughing and wheezing after exposure to cigarette smoke at home.",
        question:
          "Considering the child's frequent asthma symptoms triggered by cigarette smoke exposure, what advice would best minimize the risk of asthma attacks?",
        options: [
          "Allow smoking only outside the house",
          "Avoid smoke entirely around the child",
          "Use air fresheners to mask smoke smell",
          "Keep windows open during smoking",
        ],
        answer: "Avoid smoke entirely around the child",
        justification:
          "Smoke from cigarettes or other sources can trigger asthma attacks. The child should avoid exposure entirely; partial measures like just smoking outside or masking odors are insufficient.",
      },
      {
        id: "asthma_scenario2",
        image: "/CSAsthma2.jpg",
        paragraph:
          "During a flu season, a child with asthma has repeated coughing and chest tightness.",
        question:
          "What is the most important preventive measure to reduce asthma exacerbations triggered by viral infections such as colds or the flu in children?",
        options: [
          "Give the child antibiotics",
          "Ensure the child and caregivers get annual flu shots",
          "Limit physical activity during flu season",
          "Use asthma inhaler more frequently",
        ],
        answer: "Ensure the child and caregivers get annual flu shots",
        justification:
          "Flu and colds can trigger asthma exacerbations. Annual flu vaccinations for the child and those around them help prevent these infections and asthma attacks.",
      },
      {
        id: "asthma_scenario3",
        image: "/CSAsthma3.jpg",
        paragraph:
          "A child develops wheezing and coughing during gym class on cold, windy days.",
        question:
          "What is the best approach to prevent exercise-induced asthma attacks, especially in cold and windy environments?",
        options: [
          "Avoid exercise completely",
          "Use asthma medication before exercise and warm up properly",
          "Wear a scarf only after symptoms start",
          "Do exercise only outdoors regardless of weather",
        ],
        answer: "Use asthma medication before exercise and warm up properly",
        justification:
          "Asthma symptoms triggered by exercise can be managed by using prescribed medication before activity and warming up/cooling down appropriately. Avoiding exercise completely is not recommended.",
      },
      {
        id: "asthma_scenario4",
        image: "/CSAsthma4.jpg",
        paragraph:
          "A child’s asthma symptoms worsen when pets are allowed inside the bedroom.",
        question:
          "Which management strategy is recommended to reduce asthma symptoms triggered by pet dander in the home environment?",
        options: [
          "Keep pets out of the bedroom and clean furniture frequently",
          "Bathe pets once a month",
          "Allow pets in the bedroom only during the day",
          "Use air fresheners to neutralize pet dander",
        ],
        answer: "Keep pets out of the bedroom and clean furniture frequently",
        justification:
          "Pet dander is a common asthma trigger. Keeping pets out of sleeping areas and cleaning surfaces regularly helps reduce exposure and symptoms.",
      },
      {
        id: "asthma_scenario5",
        image: "/CSAsthma5.jpg",
        paragraph:
          "A child with asthma has worsening symptoms during days with high smog levels outdoors.",
        question:
          "What advice should be given to help control and prevent worsening asthma symptoms related to outdoor air pollution such as smog?",
        options: [
          "Spend less time outdoors when smog is high and monitor symptoms closely",
          "Increase outdoor activity to build tolerance",
          "Use quick-relief inhaler before going outside",
          "Open windows to improve indoor air circulation",
        ],
        answer: "Spend less time outdoors when smog is high and monitor symptoms closely",
        justification:
          "Air pollution like smog can worsen asthma. Reducing outdoor exposure on high pollution days and monitoring for symptoms is recommended.",
      },
    ],
  },
  "2": {
    title: "Clinical Scenarios: Nutrition in Early Childhood",
    steps: [
      {
        id: "nutrition_scenario1",
        image: "/CSNutrition1.jpg",
        paragraph:
          "An infant under 12 months is cared for at a daycare center. The caregiver is unsure about what kind of milk to offer during feeding times.",
        question:
          "According to best practices, which type of milk should the infant be fed, and what feeding method is recommended to support healthy growth and development?",
        options: [
          "Only cow’s milk, fed in a bottle while the infant is lying down",
          "Human milk or formula, fed by a caregiver holding the infant during bottle-feeding",
          "Juice diluted with water in a bottle, fed on demand",
          "Cow’s milk mixed with formula, fed when the infant cries",
        ],
        answer: "Human milk or formula, fed by a caregiver holding the infant during bottle-feeding",
        justification:
          "Infants under 12 months should be fed human milk or formula, never cow’s milk. Caregivers should hold infants during bottle feeding to promote bonding and safe swallowing.",
      },
      {
        id: "nutrition_scenario2",
        image: "/CSNutrition2.jpg",
        paragraph:
          "A caregiver wants to introduce solid foods to an infant. The infant is approaching 4 months old.",
        question:
          "When is it appropriate to start introducing solid foods to infants, and what considerations should caregivers keep in mind to ensure safe and healthy feeding?",
        options: [
          "Introduce solid foods before 4 months to help the infant sleep better",
          "Introduce solid foods at no earlier than 4 months, preferably around 6 months, based on family agreement",
          "Start solid foods only after 12 months to avoid allergies",
          "Feed solid foods in bottles to avoid choking risks",
        ],
        answer:
          "Introduce solid foods at no earlier than 4 months, preferably around 6 months, based on family agreement",
        justification:
          "Solid foods should be introduced no sooner than 4 months, preferably around 6 months, depending on readiness and family decision. Solid foods should not be given in bottles unless specified in the care plan.",
      },
      {
        id: "nutrition_scenario3",
        image: "/CSNutrition3.jpg",
        paragraph:
          "A toddler aged 18 months is offered fruit juice at daycare. The caregiver wonders how much juice is appropriate and if juice is suitable for infants.",
        question:
          "What are the guidelines regarding serving fruit juice to young children, and how should caregivers manage juice intake to support healthy nutrition?",
        options: [
          "Serve unlimited 100% fruit juice to toddlers and infants throughout the day",
          "Serve 4-6 ounces of 100% fruit juice to children over 12 months; avoid juice for infants",
          "Serve sweetened fruit drinks to infants to prevent dehydration",
          "Avoid juice entirely and only serve water and milk",
        ],
        answer:
          "Serve 4-6 ounces of 100% fruit juice to children over 12 months; avoid juice for infants",
        justification:
          "Children over 12 months may be served small amounts (4-6 ounces) of 100% fruit juice. Juice is not recommended for infants under 12 months due to nutritional concerns.",
      },
      {
        id: "nutrition_scenario4",
        image: "/CSNutrition4.jpg",
        paragraph:
          "During snack time, caregivers notice some children are reluctant to eat and some are eating while walking around. The caregivers want to create a positive mealtime environment.",
        question:
          "What practices promote healthy mealtime behavior and socialization in early childhood care settings?",
        options: [
          "Allow children to eat whenever and wherever they want without supervision",
          "Make mealtime relaxed and enjoyable with conversation; children should be seated and not forced or bribed to eat",
          "Use food as a reward or punishment to encourage eating",
          "Serve snacks in large portions to encourage children to eat more",
        ],
        answer:
          "Make mealtime relaxed and enjoyable with conversation; children should be seated and not forced or bribed to eat",
        justification:
          "Positive mealtime behavior includes relaxed settings with social interaction. Children should eat seated and food should not be used as reward or punishment to encourage healthy eating habits.",
      },
      {
        id: "nutrition_scenario5",
        image: "/CSNutrition5.jpg",
        paragraph:
          "Parents ask how they can help support healthy eating habits at home that complement the care their children receive in early childhood programs.",
        question:
          "What are effective ways families can promote good nutrition and healthy eating behaviors in young children at home?",
        options: [
          "Put babies to bed with a bottle, even if it contains water",
          "Serve nutritious foods, involve children in meal preparation, and encourage trying new foods in a fun way",
          "Limit children to only familiar foods to avoid food refusal",
          "Give children candy as a reward for eating vegetables",
        ],
        answer:
          "Serve nutritious foods, involve children in meal preparation, and encourage trying new foods in a fun way",
        justification:
          "Families can support healthy eating by serving nutritious foods, making mealtime fun, involving children in cooking and grocery shopping, and encouraging new food tastes. Avoid putting babies to bed with bottles to prevent unhealthy habits.",
      },
    ],
  },
"3": {
  title: "Clinical Scenarios: Newborn Screening & Specimen Handling",
  steps: [
    {
      id: "nbs_scenario1",
      image: "/CSScreening1.jpg",
      paragraph:
        "A newborn is delivered at 1:00 AM and the facility plans to collect a blood spot sample immediately after birth.",
      question:
        "Given the recommended timing for heel‑prick specimens, what is the best time frame to collect the screening card to ensure accurate results?",
      options: [
        "Collect immediately within the first hour of life",
        "Wait until at least 24 hours after birth before collecting",
        "Collect anytime before discharge, regardless of timing",
        "Collect only if baby shows clinical symptoms",
      ],
      answer: "Wait until at least 24 hours after birth before collecting",
      justification:
        "Blood‑spot specimens taken before 24 hours of age can yield false negatives. Newborn screening should occur at ≥ 24 hours but ideally before the newborn is 2 days old.",
    },
    {
      id: "nbs_scenario2",
      image: "/CSScreening2.jpg",
      paragraph:
        "A clinician fills out the newborn screening card but omits the collection time and writes only the DOB and name.",
      question:
        "Which missing information could compromise the specimen’s acceptability, and what should be done before sending it?",
      options: [
        "Collecting physician name; send it anyway",
        "Collection time; rewrite or update before shipping",
        "Birth weight; send and request additional sample later",
        "Mother’s consent signature; ask later",
      ],
      answer: "Collection time; rewrite or update before shipping",
      justification:
        "Accurate timing fields are essential for interpreting results. Missing collection time can lead to sample rejection or misinterpretation, so the card should be corrected before shipping.",
    },
    {
      id: "nbs_scenario3",
      image: "/CSScreening3.jpg",
      paragraph:
        "A rural clinic collects several newborn screening cards but plans to batch‑ship them in sealed bags without air‑drying.",
      question:
        "Why is it critical to air‑dry each card before packaging, and what is the recommended procedure?",
      options: [
        "Drying reduces sticker contamination; air‑dry face‑up 3‑4 hours",
        "Moisture interferes with testing; hang cards horizontally overnight until completely dry",
        "Drying ensures bar codes scan; dry in sealed bags immediately",
        "Drying is unnecessary; ship within 24 hours regardless",
      ],
      answer: "Moisture interferes with testing; hang cards horizontally overnight until completely dry",
      justification:
        "Wet or damp cards can cause inaccurate enzyme assays. The standard is to air‑dry horizontally (face‑up) for at least 3‑4 hours, preferably overnight, before sealing and shipping.",
    },
    {
      id: "nbs_scenario4",
      image: "/CSScreening4.jpg",
      paragraph:
        "A specimen arrives with circles incompletely filled, overlapping spots, and a heel‑rub that smeared onto the card margins.",
      question:
        "What are the consequences of such an unsuitable specimen, and what action should the provider take?",
      options: [
        "Lab tests anyway; if abnormal, retest",
        "Likely reject specimen; collect a new one ASAP",
        "Accept it but note quality concerns in report",
        "Store card and wait for clinical signs",
      ],
      answer: "Likely reject specimen; collect a new one ASAP",
      justification:
        "Poor specimen quality leads to rejection and delayed diagnosis. Guidelines mandate recollection as soon as possible to avoid missed or delayed detection.",
    },
    {
      id: "nbs_scenario5",
      image: "/CSScreening5.jpg",
      paragraph:
        "You receive an abnormal screening result indicating elevated phenylalanine, suggestive of phenylketonuria (PKU), for a healthy‑appearing 2‑day‑old infant.",
      question:
        "What steps should the provider take next to ensure timely diagnosis and treatment?",
      options: [
        "Repeat again in 2 weeks and monitor clinically",
        "Refer immediately for confirmatory testing and initiate dietary intervention",
        "Ignore until clinical signs develop",
        "Send specimen to another lab for re‑test",
      ],
      answer: "Refer immediately for confirmatory testing and initiate dietary intervention",
      justification:
        "An abnormal PKU screen requires prompt confirmatory testing and early dietary management to prevent neurological damage. Waiting risks irreversible harm.",
    },
  ],
},
"4": {
  title: "Clinical Scenarios: Poisoning in Children (First Aid and Prevention)",
  steps: [
    {
      id: "poison_scenario1",
      image: "/CSPoison1.jpg",
      paragraph:
        "A 2-year-old child is found holding an open bottle of eucalyptus oil, with some liquid spilled around the mouth. The child appears drowsy but alert.",
      question:
        "What is the most appropriate immediate response before calling the Poisons Information Centre?",
      options: [
        "Induce vomiting to expel any ingested oil",
        "Offer milk or water to dilute the substance",
        "Wipe the mouth and face and seek advice immediately",
        "Wait to see if symptoms worsen before acting",
      ],
      answer: "Wipe the mouth and face and seek advice immediately",
      justification:
        "Never induce vomiting or give fluids unless directed. Wipe away visible residue and contact the Poisons Information Centre (13 11 26) immediately for expert guidance.",
    },
    {
      id: "poison_scenario2",
      image: "/CSPoison2.jpg",
      paragraph:
        "During a family barbecue, a child picks and eats a mushroom from the garden. The parents are unsure if it’s toxic and the child is asymptomatic.",
      question:
        "What should be done right away, considering the potential for poisonous plants?",
      options: [
        "Wait for symptoms to develop before acting",
        "Induce vomiting and monitor the child closely",
        "Call the Poisons Information Centre with a photo or sample of the mushroom",
        "Flush the mouth and send the child to school",
      ],
      answer: "Call the Poisons Information Centre with a photo or sample of the mushroom",
      justification:
        "Some mushrooms are highly toxic. Prompt identification is key. Collect a sample (if safe), take a photo, and call 13 11 26 for advice before symptoms appear.",
    },
    {
      id: "poison_scenario3",
      image: "/CSPoison3.jpg",
      paragraph:
        "A 5-year-old child visits a relative’s house and finds iron tablets on a bedside table. The caregiver notices several pills missing and suspects ingestion.",
      question:
        "What factors increase poisoning risk in this situation, and what is the correct response?",
      options: [
        "Children mimic adults; call the Poisons Centre immediately",
        "Iron is harmless in small doses; monitor at home",
        "Iron tastes bad; child likely spit them out",
        "Ask the child how many they ate and calculate the dose",
      ],
      answer: "Children mimic adults; call the Poisons Centre immediately",
      justification:
        "Children imitate adult behavior, and iron tablets are a common cause of serious toxicity. Immediate advice from the Poisons Information Centre is essential.",
    },
    {
      id: "poison_scenario4",
      image: "/CSPoison4.jpg",
      paragraph:
        "A toddler accesses a cleaning spray left on the kitchen counter and is now coughing after spraying it into the air and possibly inhaling it.",
      question:
        "What should be your first step before calling for poison advice?",
      options: [
        "Give the child water to soothe the airways",
        "Keep the child in the kitchen to monitor symptoms",
        "Move the child to fresh air immediately and ventilate the space",
        "Induce vomiting in case of ingestion",
      ],
      answer: "Move the child to fresh air immediately and ventilate the space",
      justification:
        "Inhaled poisons require quick removal from the source. Move the child to fresh air and call 13 11 26 for further guidance.",
    },
    {
      id: "poison_scenario5",
      image: "/CSPoison5.jpg",
      paragraph:
        "You are reviewing household safety with a new parent. Medications are stored high up but in an open shelf. Cleaning agents are in their original containers under the sink.",
      question:
        "What recommendations would you give to reduce poisoning risk in this home?",
      options: [
        "Storing medications out of sight is enough; no further changes needed",
        "Cleaning products should remain accessible for convenience",
        "All potential poisons should be in locked or child-resistant storage above 1.5 meters",
        "Keep products in original packaging but transfer to a single drawer",
      ],
      answer: "All potential poisons should be in locked or child-resistant storage above 1.5 meters",
      justification:
        "Storage above 1.5 meters and in locked cabinets greatly reduces risk. Medicines and chemicals should be stored separately and out of children’s reach.",
    },
  ]
}


  
};

const ClinicalScenarioPage = () => {
  const { id } = useParams(); // '0' for milestone, '1' for asthma, '2' for nutrition, etc.
  const navigate = useNavigate();

  const scenarioData = scenariosByMaterial[id];

  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    setStepIndex(0);
    setSelected(null);
    setShowAnswer(false);
    setCanProceed(false);
  }, [id]);

  useEffect(() => {
    if (showAnswer) {
      const timer = setTimeout(() => setCanProceed(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setCanProceed(false);
    }
  }, [showAnswer]);

  if (!scenarioData) {
    return (
      <div style={{ maxWidth: 600, margin: "4rem auto", textAlign: "center" }}>
        <h2>Scenario not found</h2>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  const currentStep = scenarioData.steps[stepIndex];

  const handleSelect = (option) => {
    if (!showAnswer) {
      setSelected(option);
      setShowAnswer(true);
    }
  };

  const handleNext = () => {
    if (stepIndex + 1 < scenarioData.steps.length) {
      setStepIndex(stepIndex + 1);
      setSelected(null);
      setShowAnswer(false);
      setCanProceed(false);
    } else {
      navigate(`/materials/${id}`); // Return to material overview
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        padding: "2rem",
        borderRadius: 16,
        backgroundColor: "#F9F9F9",
        boxShadow: "0 8px 24px rgba(0, 114, 206, 0.12)",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        color: "#2E2E2E",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: "#0072CE",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: 10,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: "1.5rem",
        }}
      >
        ← Back
      </button>

      <h1
        style={{
          color: "#0072CE",
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "1rem",
        }}
      >
        {scenarioData.title}
      </h1>

      {currentStep.image && (
        <img
          src={currentStep.image}
          alt="Scenario"
          style={{
            width: "100%",
            maxHeight: 300,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: "1rem",
          }}
        />
      )}

      <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
        {currentStep.paragraph}
      </p>

      <p
        style={{
          fontWeight: "600",
          fontSize: "1.1rem",
          marginBottom: "0.75rem",
        }}
      >
        {currentStep.question}
      </p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {currentStep.options.map((option) => (
          <li key={option} style={{ marginBottom: "0.75rem" }}>
            <button
              onClick={() => handleSelect(option)}
              disabled={showAnswer}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                textAlign: "left",
                borderRadius: 10,
                border: "2px solid #0072CE",
                backgroundColor:
                  showAnswer && option === currentStep.answer
                    ? "#C8E6C9"
                    : showAnswer && option === selected && option !== currentStep.answer
                    ? "#FFCDD2"
                    : "white",
                color: "#2E2E2E",
                fontWeight: 600,
                cursor: showAnswer ? "default" : "pointer",
                transition: "background-color 0.3s ease",
              }}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>

      {showAnswer && (
        <div style={{ marginTop: "1.25rem" }}>
          {selected === currentStep.answer ? (
            <p style={{ color: "green", fontWeight: "600" }}>✅ Correct!</p>
          ) : (
            <p style={{ color: "red", fontWeight: "600" }}>
              ❌ Incorrect. Correct answer: {currentStep.answer}
            </p>
          )}

          <p
            style={{
              marginTop: "0.5rem",
              fontStyle: "italic",
              color: "#555",
            }}
          >
            {currentStep.justification}
          </p>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1.25rem",
              backgroundColor: canProceed ? "#0072CE" : "#9BBDE6",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontWeight: "600",
              fontSize: "1rem",
              cursor: canProceed ? "pointer" : "default",
              transition: "background-color 0.3s ease",
            }}
          >
            {stepIndex + 1 < scenarioData.steps.length
              ? "Next Scenario →"
              : "Finish and Return"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ClinicalScenarioPage;
