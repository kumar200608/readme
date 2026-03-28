"""
Kumar V — Portfolio Backend API
Flask REST API powering the portfolio website
Run: python app.py
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app)

# ─── Portfolio Data ───────────────────────────────────────────
PORTFOLIO = {
    "name": "Kumar V",
    "title": "Full Stack Developer & AI Engineer",
    "location": "Erode, Tamil Nadu, India",
    "college": "Erode Sengunthar Engineering College",
    "degree": "B.E. Artificial Intelligence & Data Science",
    "regulation": "R-2023",
    "graduation": 2028,
    "github": "kumar200608",
    "linkedin": "kumar-v-a7405a339",
    "roles": [
        "Full Stack Developer",
        "AI Developer",
        "Python Engineer",
        "IoT Builder",
        "Problem Solver"
    ]
}

SKILLS = [
    {"name": "Python",        "level": 88, "category": "Language"},
    {"name": "React / JS",    "level": 82, "category": "Frontend"},
    {"name": "C Programming", "level": 78, "category": "Language"},
    {"name": "SQL",           "level": 75, "category": "Database"},
    {"name": "IoT Systems",   "level": 72, "category": "Hardware"},
    {"name": "Machine Learning", "level": 70, "category": "AI/ML"},
]

TECH_STACK = [
    "Python", "React", "JavaScript", "C", "SQL", "MySQL",
    "Flask", "Django", "Node.js", "IoT", "Arduino", "Git", "Linux",
    "TensorFlow", "Scikit-learn", "NumPy", "Pandas"
]

PROJECTS = [
    {
        "id": 1,
        "name": "Rovia Delice",
        "description": "Full-stack restaurant & food discovery platform with AI-powered recommendations, real-time order tracking, and a sleek modern UI.",
        "tech": ["React", "Python", "Flask", "MySQL", "AI/ML", "REST API"],
        "github": "https://github.com/kumar200608/rovia-delice",
        "live": "https://rovia-delice.vercel.app/",
        "featured": True,
        "status": "active"
    },
    {
        "id": 2,
        "name": "IoT Smart Monitor",
        "description": "Real-time sensor data dashboard with Arduino & Python. Tracks temperature, humidity and sends smart alerts.",
        "tech": ["Python", "IoT", "Arduino", "Dashboard"],
        "featured": False,
        "status": "completed"
    },
    {
        "id": 3,
        "name": "AI Data Classifier",
        "description": "ML classification pipeline with Scikit-learn. Trains, evaluates and deploys predictive models with clean APIs.",
        "tech": ["Python", "ML", "Scikit-learn", "REST API"],
        "featured": False,
        "status": "completed"
    }
]

CERTIFICATIONS = [
    {
        "title": "Microsoft AI Fundamentals",
        "issuer": "Microsoft",
        "year": 2024,
        "status": "completed"
    },
    {
        "title": "Certified Ethical Hacker (CEH)",
        "issuer": "EC-Council",
        "year": 2025,
        "status": "in-progress"
    },
    {
        "title": "Hackathon Participation",
        "issuer": "CodTech IT Solutions",
        "year": 2024,
        "status": "completed"
    }
]

ACHIEVEMENTS = [
    {"icon": "🏀", "title": "State-Level Basketball", "category": "Sports"},
    {"icon": "🏸", "title": "State-Level Badminton",  "category": "Sports"},
    {"icon": "🎖️", "title": "NCC Cadet",              "category": "Military"},
    {"icon": "💡", "title": "AI Innovator",            "category": "Tech"},
]

# ─── Routes ──────────────────────────────────────────────────
@app.route("/")
def index():
    return jsonify({
        "status": "online",
        "message": "Kumar V — Portfolio API",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "endpoints": [
            "/api/profile",
            "/api/skills",
            "/api/tech-stack",
            "/api/projects",
            "/api/certifications",
            "/api/achievements",
            "/api/all"
        ]
    })

@app.route("/api/profile")
def profile():
    return jsonify(PORTFOLIO)

@app.route("/api/skills")
def skills():
    category = request.args.get("category")
    data = SKILLS
    if category:
        data = [s for s in SKILLS if s["category"].lower() == category.lower()]
    return jsonify({"skills": data, "total": len(data)})

@app.route("/api/tech-stack")
def tech_stack():
    return jsonify({"tech": TECH_STACK, "total": len(TECH_STACK)})

@app.route("/api/projects")
def projects():
    featured_only = request.args.get("featured")
    data = PROJECTS
    if featured_only == "true":
        data = [p for p in PROJECTS if p.get("featured")]
    return jsonify({"projects": data, "total": len(data)})

@app.route("/api/certifications")
def certifications():
    return jsonify({"certifications": CERTIFICATIONS, "total": len(CERTIFICATIONS)})

@app.route("/api/achievements")
def achievements():
    return jsonify({"achievements": ACHIEVEMENTS, "total": len(ACHIEVEMENTS)})

@app.route("/api/all")
def all_data():
    return jsonify({
        "profile": PORTFOLIO,
        "skills": SKILLS,
        "tech_stack": TECH_STACK,
        "projects": PROJECTS,
        "certifications": CERTIFICATIONS,
        "achievements": ACHIEVEMENTS,
    })

# ─── Contact form endpoint ────────────────────────────────────
@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    name    = data.get("name", "").strip()
    email   = data.get("email", "").strip()
    message = data.get("message", "").strip()
    if not all([name, email, message]):
        return jsonify({"error": "name, email, and message are required"}), 400
    # In production: send email via SMTP / save to DB
    print(f"[Contact] From: {name} <{email}> | Message: {message[:80]}...")
    return jsonify({"success": True, "message": f"Thanks {name}! I'll get back to you soon 🚀"})

# ─── Run ──────────────────────────────────────────────────────
if __name__ == "__main__":
    print("🚀 Kumar V — Portfolio API running at http://localhost:5000")
    app.run(debug=True, port=5000)
