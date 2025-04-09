import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm({ login }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitting login with:", formData); //DEBUGGING: Log form data

    try {
      await login(formData);
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(
        "Login failed:",
        err.response ? err.response.data : err.message
      );

      setError("Invalid Credentials. Please Try Again.");
    }
  }

  return (
    <div className="LoginForm-container">
      <div className="LoginForm">
        <h2>Welcome Back!</h2>
        <p>Please login below to access your account</p>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">USERNAME:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoFocus
              required
            />
          </div>
          <div>
            <label htmlFor="password">PASSWORD:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
