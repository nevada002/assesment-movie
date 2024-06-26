import { Routes, Route } from "react-router-dom";
import MovieList from "./pages/MovieList";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieList />} />
    </Routes>
  );
}