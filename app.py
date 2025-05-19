from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # อนุญาตให้ frontend เรียก API ได้

@app.route("/")
def index():
    return render_template("nimman.html")
if __name__ == "__main__":
    app.run(debug=True)
