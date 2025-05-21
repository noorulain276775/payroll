import React, { useState } from "react";
import logo from '../../src/assets/brand/logo.png';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = () => {
  };

return (
    <div
      className="app d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: "20px",
      }}
    >
      {/* Logo Section */}
      <div
        className="mb-4 d-flex justify-content-center"
        style={{ width: "150px" }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </div>

      {/* Card Container */}
      <div className="card shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-3" style={{ fontWeight: "700" }}>
            Login
          </h2>
          <p className="text-center text-muted mb-4">
            Sign In to your account
          </p>

          <div className="input-group mb-3 shadow-sm">
            <div className="input-group-prepend">
              <span className="input-group-text bg-white">
                <i className="icon-user"></i>
              </span>
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ boxShadow: "none" }}
            />
          </div>

          <div className="input-group mb-4 shadow-sm">
            <div className="input-group-prepend">
              <span className="input-group-text bg-white">
                <i className="icon-lock"></i>
              </span>
            </div>
            <input
              className="form-control"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ boxShadow: "none" }}
            />
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={handleLogin}
            style={{
              fontWeight: "600",
              padding: "10px",
              borderRadius: "8px",
              letterSpacing: "0.05em",
            }}
          >
            Login
          </button>
        </div>
      </div>

      {/* Optional Footer Text */}
      <div className="text-center text-white mt-4" style={{ fontSize: "0.9rem" }}>
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </div>
  );
};

export default React.memo(Login)
