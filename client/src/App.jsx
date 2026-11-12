
import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

const initialForm = {
  name: "",
  department: "",
  regNo: "",
  sessionTitle: "",
  q1: "",
  q2: "",
  q3: "",
  q4: "",
  q5: "",
  q6: ""
};

function Survey() {
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(`${API}/feedback`, formData);

      setMessage("Feedback submitted successfully!");
      setFormData(initialForm);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to submit feedback."
      );
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h2>Online Survey</h2>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <header className="header">
        <h1>Online Survey Application</h1>
        <p>Feedback Survey</p>
      </header>

      <main className="survey-container">
        <h2>Student Feedback Form</h2>
        <p className="intro">
          Please complete all the details and share your feedback.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Student Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select department</option>
              <option>IT</option>
              <option>CSE</option>
              <option>ECE</option>
              <option>EEE</option>
              <option>Mechanical</option>
              <option>Civil</option>
            </select>
          </div>

          <div className="form-group">
            <label>Register Number</label>
            <input
              type="text"
              name="regNo"
              value={formData.regNo}
              onChange={handleChange}
              placeholder="Enter register number"
              required
            />
          </div>

          <div className="form-group">
            <label>Session Title</label>
            <input
              type="text"
              name="sessionTitle"
              value={formData.sessionTitle}
              onChange={handleChange}
              placeholder="Enter session title"
              required
            />
          </div>

          <h3 className="section-title">Survey Questions</h3>

          <div className="form-group">
            <label>1. What type of session did you attend?</label>
            <select name="q1" value={formData.q1} onChange={handleChange} required>
              <option value="">Choose an option</option>
              <option>Technical Training</option>
              <option>Workshop</option>
              <option>Seminar</option>
              <option>Webinar</option>
              <option>Hands-on Training</option>
            </select>
          </div>

          <div className="form-group">
            <label>2. Which topic did you like most?</label>
            <select name="q2" value={formData.q2} onChange={handleChange} required>
              <option value="">Choose a topic</option>
              <option>Programming</option>
              <option>Data Science</option>
              <option>Web Development</option>
              <option>Artificial Intelligence</option>
              <option>Cybersecurity</option>
            </select>
          </div>

          <div className="form-group">
            <label>3. Rate the session (1–5)</label>
            <select name="q3" value={formData.q3} onChange={handleChange} required>
              <option value="">Select rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          <div className="form-group">
            <label>4. Would you recommend this session?</label>
            <select name="q4" value={formData.q4} onChange={handleChange} required>
              <option value="">Choose an option</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="form-group">
            <label>5. What did you learn from this session?</label>
            <textarea
              name="q5"
              value={formData.q5}
              onChange={handleChange}
              placeholder="Write what you learned..."
              required
            />
          </div>

          <div className="form-group">
            <label>6. Suggestions for improvement</label>
            <textarea
              name="q6"
              value={formData.q6}
              onChange={handleChange}
              placeholder="Enter your suggestions (optional)"
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit Feedback
          </button>

          {message && <p className="message">{message}</p>}
        </form>
      </main>
    </div>
  );
}

function Dashboard() {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({
    totalResponses: 0,
    averageRating: "0.0",
    recommendCount: 0,
    departmentCounts: {}
  });
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const loadDashboard = async () => {
    try {
      const [feedbackResponse, statsResponse] = await Promise.all([
        axios.get(`${API}/feedback`),
        axios.get(`${API}/dashboard`)
      ]);

      setFeedback(feedbackResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Dashboard loading error:", error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const departments = [
    "All",
    ...Object.keys(stats.departmentCounts)
  ];

  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.regNo.toLowerCase().includes(search.toLowerCase()) ||
      item.sessionTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.q5.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      department === "All" || item.department === department;

    return matchesSearch && matchesDepartment;
  });

  const exportCSV = () => {
    const headers = [
      "Name",
      "Department",
      "Register Number",
      "Session Title",
      "Session Type",
      "Favorite Topic",
      "Rating",
      "Recommend",
      "Learning",
      "Suggestions",
      "Submitted Date"
    ];

    const rows = feedback.map(item => [
      item.name,
      item.department,
      item.regNo,
      item.sessionTitle,
      item.q1,
      item.q2,
      item.q3,
      item.q4,
      item.q5,
      item.q6,
      new Date(item.submittedAt).toLocaleString()
    ]);

    const escapeCSV = value =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [
      headers,
      ...rows
    ].map(row => row.map(escapeCSV).join(",")).join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "survey_feedback.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    try {
      await axios.delete(`${API}/feedback/${id}`);
      loadDashboard();
    } catch (error) {
      alert("Unable to delete feedback.");
    }
  };

  return (
    <div className="app dashboard-page">

      <nav className="navbar">
        <h2>Survey Dashboard</h2>
        <Link to="/">Back to Survey Form</Link>
      </nav>

      <header className="header">
        <h1>Survey Dashboard</h1>
        <p>Feedback Analysis and Reports</p>
      </header>

      <main className="dashboard-container">

        <div className="stats-grid">

          <div className="stat-card">
            <p>Total Responses</p>
            <h2>{stats.totalResponses}</h2>
          </div>

          <div className="stat-card">
            <p>Average Rating</p>
            <h2>{stats.averageRating} / 5</h2>
          </div>

          <div className="stat-card">
            <p>Would Recommend</p>
            <h2>{stats.recommendCount}</h2>
          </div>

        </div>

        <section className="dashboard-card">
          <h2>Responses by Department</h2>

          {Object.entries(stats.departmentCounts).length === 0 ? (
            <p>No department responses yet.</p>
          ) : (
            Object.entries(stats.departmentCounts).map(([dept, count]) => (
              <div className="department-row" key={dept}>
                <div className="department-info">
                  <span>{dept}</span>
                  <strong>{count}</strong>
                </div>

                <div className="bar-background">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${
                        stats.totalResponses
                          ? (count / stats.totalResponses) * 100
                          : 0
                      }%`
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </section>

        <section className="dashboard-card">

          <div className="feedback-heading">
            <h2>All Feedback</h2>

            <button
              className="export-btn"
              onClick={exportCSV}
              disabled={feedback.length === 0}
            >
              Export CSV
            </button>
          </div>

          <div className="filter-row">

            <input
              type="text"
              placeholder="Search name, register number, session or feedback..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept}>{dept}</option>
              ))}
            </select>

          </div>

          <p className="result-count">
            {filteredFeedback.length} response(s) found
          </p>

          {filteredFeedback.length === 0 ? (
            <p className="empty-message">No feedback records found.</p>
          ) : (
            <div className="feedback-list">

              {filteredFeedback.map(item => (
                <div className="feedback-item" key={item._id}>

                  <h3>{item.name}</h3>

                  <div className="details-grid">
                    <p><strong>Department:</strong> {item.department}</p>
                    <p><strong>Register No:</strong> {item.regNo}</p>
                    <p><strong>Session:</strong> {item.sessionTitle}</p>
                    <p><strong>Session Type:</strong> {item.q1}</p>
                    <p><strong>Favorite Topic:</strong> {item.q2}</p>
                    <p><strong>Rating:</strong> {item.q3}/5</p>
                    <p><strong>Recommend:</strong> {item.q4}</p>
                  </div>

                  <p><strong>Learning:</strong> {item.q5}</p>
                  <p><strong>Suggestions:</strong> {item.q6 || "None"}</p>

                  <p className="date-text">
                    Submitted: {new Date(item.submittedAt).toLocaleString()}
                  </p>

                  <button
                    className="delete-btn"
                    onClick={() => deleteFeedback(item._id)}
                  >
                    Delete
                  </button>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Survey />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
