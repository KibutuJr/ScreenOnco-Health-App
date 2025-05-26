from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from pathlib import Path
import pandas as pd

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Load the trained model
MODEL_PATH = Path(__file__).parent / "model.pkl"
model = joblib.load(MODEL_PATH)

# Use the feature names recorded at training time
FEATURE_NAMES = list(model.feature_names_in_)

@app.route("/predict", methods=["POST"])
def predict():
    """
    Expects a JSON payload with exactly these 9 numeric fields:
      ClumpThickness,
      CellSizeUniformity,
      CellShapeUniformity,
      MarginalAdhesion,
      EpithelialCellSize,
      BareNuclei,
      BlandChromatin,
      NormalNucleoli,
      Mitoses
    Returns JSON: { riskScore: float, label: "High Risk"|"Low Risk" }
    """
    data = request.get_json()

    # Ensure we have all needed keys
    missing = [k for k in FEATURE_NAMES if k not in data]
    if missing:
        return jsonify({"error": f"Missing features: {missing}"}), 400

    # Build a single-row DataFrame with the correct column order
    X = pd.DataFrame([data], columns=FEATURE_NAMES)

    # Predict probability of class “1” (Malignant)
    prob = float(model.predict_proba(X)[0][1])
    label = "High Risk" if prob > 0.7 else "Low Risk"

    return jsonify({"riskScore": prob, "label": label})

if __name__ == "__main__":
    # Serve on port 6000—won’t conflict with your Node.js server
    app.run(host="0.0.0.0", port=6000)
