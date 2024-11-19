// import { useState } from "react"
// import { useHistory } from "react-router-dom"
// import { useDispatch } from "react-redux"
// import { login } from "actions/auth"
// import { Link } from "react-router-dom"

// function Login() {
//   const history = useHistory()
//   const dispatch = useDispatch()
//   const [username, setUsername] = useState("ahmed")
//   const [password, setPassword] = useState("ivana")
//   const [error, setError] = useState()

//   function handleSubmit() {
//     dispatch(login(username, password))
//       .then(() => {
//         history.push("/")
//       })
//       .catch(err => {
//         setError(err.response.data)
//       })
//   }

//   return (
//     <div className="col-md-12">
//       <div className="card card-container">
//         {error && <div className="alert alert-danger">{error}</div>}

//         <div className="form-group">
//           <label htmlFor="username">Username</label>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Username"
//             value={username}
//             onChange={e => setUsername(e.target.value)}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             className="form-control"
//             placeholder="Password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//           />
//         </div>
//         <button
//           className="w-100 btn btn-lg btn-primary submit-button"
//           onClick={handleSubmit}
//           disabled={!username}
//         >
//           Log in
//         </button>

//         <div className="centered">
//           don't have an account?
//           <Link to="/signup" className="auth-link">
//             Sign up
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { useDispatch } from "react-redux";
import { login } from "actions/auth";
import "../Login/login.css";

const Login = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch();
  const [username, setUsername] = useState("ahmed");
  const [password, setPassword] = useState("ivana");
  const [error, setError] = useState();

  function handleSubmit(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    dispatch(login(username, password))
      .then(() => {
        navigate("/"); // Replace history.push with navigate
      })
      .catch((err) => {
        setError(err.response.data);
      });
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="h2">Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group password-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={!username}>
            Login
          </button>
        </form>
        <a href="#" className="forgot-password">Forgot password?</a>
        <p>
          Don't have an account? <a href="/signup" className="signup-link">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
