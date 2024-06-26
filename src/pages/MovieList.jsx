import React, { useEffect, useState } from 'react';
import { getMovieList, searchMovie } from '../api';

export default function MovieList() {
    const [popularMovies, setPopularMovies] = useState([]);

    useEffect(() => {
        getMovieList().then((results) => setPopularMovies(results));
    }, []);

    const PopularMovieList = () => {
        return popularMovies.map((movie, i) => {
            return (
                <div className="Movie-wrapper" key={i}>
                    <div className="Movie-title">{movie.title}</div>
                    <img className="Movie-image" src={`${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`} alt="Movie Poster" />
                    <div className="Movie-date">{movie.release_date}</div>
                    <div className="Movie-rate">{movie.vote_average}</div>
                </div>
            )
        })
    }

    const search = async (q) => {
        if (q.length === 0) {
            const results = await getMovieList();
            setPopularMovies(results);
            return;
        }

        if (q.length > 3) {
            const query = await searchMovie(q)
            setPopularMovies(query.results)
        }
    };

    return (
        <div className='App'>
            <div className="App-header">
                <h1>Assesment TMBD</h1>
            </div>
            <input
                type="text"
                placeholder="Cari Film..."
                className="Movie-search"
                onChange={({ target }) => search(target.value)}
            />
            <div className="Movie-container">
                <PopularMovieList />
            </div>
        </div>
    );
}
