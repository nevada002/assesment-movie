import { Routes, Route } from "react-router-dom"
import MovieList from "./pages/MovieList"
import MovieDetails from "./pages/MovieDetails"
import Layout from "./components/Layouts/Layout"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<MovieList />} />
        <Route path="/:movieId" element={<MovieDetails />} />
      </Route>
    </Routes>
  )
}