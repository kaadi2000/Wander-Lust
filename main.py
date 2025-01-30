from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import json

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a secure secret key

data_file = 'locations.json'  # File to store locations

# Load existing locations
def load_locations():
    try:
        with open(data_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_locations(locations):
    with open(data_file, 'w') as f:
        json.dump(locations, f, indent=4)

@app.route('/')
def index():
    locations = load_locations()
    return render_template('index.html', locations=locations)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == 'admin' and password == 'password':  # Change credentials
            session['logged_in'] = True
            return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('index'))

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    if 'logged_in' not in session:
        return redirect(url_for('login'))
    locations = load_locations()
    return render_template('dashboard.html', locations=locations)

@app.route('/add_location', methods=['POST'])
def add_location():
    if 'logged_in' not in session:
        return redirect(url_for('login'))
    
    data = request.json
    locations = load_locations()
    locations.append(data)
    save_locations(locations)
    return jsonify({'message': 'Location added successfully'}), 200

@app.route('/get_locations')
def get_locations():
    return jsonify(load_locations())

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Ensure it runs on port 5000
