import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = () => {
    console.log("Logging in with:", username, password);
  };

  return (
    <div className="app flex-row align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card-group">
              <div className="card p-4">
                <div className="card-body">
                  <h1>Login</h1>
                  <p className="text-muted">Sign In to your account</p>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="icon-user"></i>
                      </span>
                    </div>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-4">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="icon-lock"></i>
                      </span>
                    </div>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <button className="btn btn-primary px-4" onClick={handleLogin}>
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login)
