import React, { useState, useEffect } from 'react';
import { getMovieList, searchMovie } from '../api';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './MovieList.module.css'

export default function MovieList() {
    const [popularMovies, setPopularMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        fetchPopularMovies();
    }, []);

    const fetchPopularMovies = async () => {
        try {
            setIsLoading(true);
            const results = await getMovieList(currentPage);
            setPopularMovies(prevMovies => [...prevMovies, ...results]);
            setCurrentPage(prevPage => prevPage + 1);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setHasError(true);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault()
        const query = e.target.value;
        setSearchTerm(query);

        if (query.length === 0) {
            return fetchPopularMovies();
        }

        if (query.length > 3) {
            try {
                setIsLoading(true);
                const results = await searchMovie(query, 1);
                setPopularMovies(results.results);
                setCurrentPage(1);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setHasError(true);
            }
        }
    };

    const renderMovieList = () => {
        return popularMovies.map((movie, index) => {
            return (
                <div className={styles.MovieWrapper} key={index}>
                    <div className={styles.MovieTitle}>{movie.title}</div>
                    <img className={styles.MovieImage} src={`${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`} alt="Movie Poster" />
                    <div className={styles.MovieDate}>{movie.release_date}</div>
                    <div className={styles.MovieRate}>{movie.vote_average}</div>
                </div>
            );
        });
    };

    return (
        <div className={styles.App}>
            <div className={styles.AppHeader}>
                <h1>Assesment TMBD</h1>
            </div>
            <div className={styles.MovieSearchContainer}>
                <input
                    type="text"
                    placeholder="Search Movies..."
                    className={styles.MovieSearchInput}
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button className={styles.MovieSearchClear} onClick={() => setSearchTerm('')}>Clear</button>
            </div>
            {hasError && <div className={styles.ErrorMessage}>An error occurred. Please try again.</div>}
            {isLoading && <div className={styles.LoadingMessage}>Loading...</div>}
            <InfiniteScroll
                dataLength={popularMovies.length}
                next={fetchPopularMovies}
                hasMore={true}
                loader={<div className={styles.LoadingIcon}></div>}
                className={styles.MovieListContainer}
            >
                {renderMovieList()}
            </InfiniteScroll>
        </div>
    );
}
