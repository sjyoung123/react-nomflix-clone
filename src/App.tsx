import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <>
      <Router basename={process.env.PUBLIC_URL}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tv" element={<Tv />} />
          <Route path="/tv/:id" element={<Tv />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search/:id" element={<Search />} />
          <Route path="/:id" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
