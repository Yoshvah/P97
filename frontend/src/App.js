// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirection
// import { useSelector } from "react-redux";
// import "stylesheet/form.css";
// // PAGES
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Accueil from "./pages/Accueil";
// import Main from "./pages/Main";

// function App() {
//   const { isLoggedIn } = useSelector((state) => state.auth);

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
//           <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />
//           <Route path="/Accueil" element={isLoggedIn ? <Navigate to="/" /> : <Accueil />} />

//           {/* Private Routes */}
//           <Route
//             path="/Mook/*"
//             element={isLoggedIn ? <Main /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/"
//             element={isLoggedIn ? <Main /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/message"
//             element={isLoggedIn ? <Main /> : <Navigate to="/login" />}
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";  // Import Routes, Route, Navigate
import { useSelector } from "react-redux";
import "stylesheet/form.css";

// PAGES
import Accueil from "./pages/Accueil";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "pages/Main";
function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  console.log('All Environment Variables:', process.env);


  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login />}  // If logged in, redirect to home
          />
          <Route
            path="/signup"
            element={isLoggedIn ? <Navigate to="/" /> : <Signup />}  // If logged in, redirect to home
          />
          <Route
            path="/Accueil"
            element={isLoggedIn ? <Navigate to="/Accueil" /> : <Accueil />}  // If logged in, redirect to home
          />

          {/* Private Route */}
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/Mook/message" /> : <Navigate to="/Accueil" />}
          />
          <Route
            path="/Mook/*"
            element={isLoggedIn ? <Main /> : <Navigate to="/login" />}
          />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
