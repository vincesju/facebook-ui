import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewsFeed from "./pages/NewsFeed";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewsFeed />} />
      </Routes>
    </Router>
  );
}

export default App;