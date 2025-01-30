from flask import Flask, render_template, jsonify
import pandas as pd

app = Flask(__name__)

# Load location data from Excel
def load_location_data():
    try:
        df = pd.read_csv("data.csv")  # Ensure this file exists in the project folder
        return df.to_dict(orient="records")  # Convert dataframe to list of dictionaries
    except Exception as e:
        return str(e)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get_locations")
def get_locations():
    data = load_location_data()
    return jsonify(data)  # Send JSON response to frontend

if __name__ == "__main__":
    app.run(debug=True)