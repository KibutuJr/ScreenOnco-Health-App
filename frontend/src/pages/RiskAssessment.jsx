// src/pages/RiskAssessment.jsx

import React, { useState } from "react";

export default function RiskAssessment() {
  // Form state
  const [age, setAge] = useState("");
  const [familyHistory, setFamilyHistory] = useState("no");
  const [geneticMutation, setGeneticMutation] = useState("no");
  const [bmi, setBmi] = useState("");
  const [menarcheAge, setMenarcheAge] = useState("");
  const [menopauseAge, setMenopauseAge] = useState("");
  const [children, setChildren] = useState("");
  const [hormoneTherapy, setHormoneTherapy] = useState("no");

  // Submission state
  const [loading, setLoading] = useState(false);
  const [riskScore, setRiskScore] = useState(null);
  const [riskCategory, setRiskCategory] = useState("");
  const [error, setError] = useState("");

  // Map score → category
  const categorize = (score) => {
    if (score < 0.2) return "Low";
    if (score < 0.5) return "Moderate";
    return "High";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setRiskScore(null);
    setRiskCategory("");
    // basic validation
    if (!age || !bmi || !menarcheAge || !menopauseAge || !children) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      // TODO: replace with real backend call
      // const res = await fetch("/api/risk", { method: "POST", body: JSON.stringify({ age, familyHistory, ... }) });
      // const { score } = await res.json();

      // Simulate AI model latency & output
      await new Promise((r) => setTimeout(r, 1500));
      const score = Math.random(); // placeholder

      setRiskScore(score.toFixed(2));
      setRiskCategory(categorize(score));
    } catch (err) {
      console.error(err);
      setError("Failed to calculate risk. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          AI-Powered Breast Cancer Risk Assessment
        </h1>
        <p className="mb-6 text-gray-600">
          Please complete the form below. Our AI model will estimate your 5-year
          breast cancer risk.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
      >
        {error && <div className="text-red-600 font-medium">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Age *</label>
            <input
              type="number"
              min="18"
              max="100"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">BMI *</label>
            <input
              type="number"
              step="0.1"
              min="10"
              max="60"
              value={bmi}
              onChange={(e) => setBmi(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Family History? *</label>
            <select
              value={familyHistory}
              onChange={(e) => setFamilyHistory(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Known Genetic Mutation? *
            </label>
            <select
              value={geneticMutation}
              onChange={(e) => setGeneticMutation(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Age at Menarche *</label>
            <input
              type="number"
              min="8"
              max="20"
              value={menarcheAge}
              onChange={(e) => setMenarcheAge(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Age at Menopause *</label>
            <input
              type="number"
              min="35"
              max="60"
              value={menopauseAge}
              onChange={(e) => setMenopauseAge(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Number of Children *
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={children}
              onChange={(e) => setChildren(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Hormone Therapy? *</label>
            <select
              value={hormoneTherapy}
              onChange={(e) => setHormoneTherapy(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Calculating…" : "Calculate My Risk"}
        </button>
      </form>

      {riskScore !== null && (
        <div className="mt-8 bg-blue-50 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-2">Your Risk Score</h2>
          <p className="text-6xl font-bold text-blue-700">
            {(riskScore * 100).toFixed(0)}%
          </p>
          <p className="text-xl mt-2">
            Category:{" "}
            <span
              className={
                riskCategory === "High"
                  ? "text-red-600"
                  : riskCategory === "Moderate"
                  ? "text-yellow-600"
                  : "text-green-600"
              }
            >
              {riskCategory}
            </span>
          </p>
          <p className="mt-4 text-gray-700">
            This estimate is provided by our proprietary AI model. Use it as a
            guide—consult your healthcare provider for personalized advice.
          </p>
        </div>
      )}
    </div>
  );
}
