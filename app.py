from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # อนุญาตให้ frontend เรียก API ได้

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/home")
def home():
    return render_template("homescreen.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/chatbot")
def chatbot():
    return render_template("chatbot.html")

if __name__ == "__main__":
    app.run(debug=True)
