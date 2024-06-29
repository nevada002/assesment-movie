import React, { useState, useEffect } from 'react'
import { getMovieList, searchMovie } from '../api'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from './MovieList.module.css'
import { Link } from 'react-router-dom'

export default function MovieList() {
    const [popularMovies, setPopularMovies] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    let timeoutId = null

    useEffect(() => {
        fetchPopularMovies()
    }, [])

    const fetchPopularMovies = async () => {
        try {
            setIsLoading(true)
            const results = await getMovieList(currentPage)
            setPopularMovies(prevMovies => [...prevMovies, ...results])
            setCurrentPage(prevPage => prevPage + 1)
            setIsLoading(false)
        } catch (error) {
            console.error(error)
            setHasError(true)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        const query = e.target.value

        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        setSearchTerm(query)

        if (query.length < 3) {
            setPopularMovies([])
            return fetchPopularMovies()
        }

        if (query.length >= 3) {
            timeoutId = setTimeout(async () => {
                try {
                    setIsLoading(true)
                    const results = await searchMovie(query, 1)
                    setPopularMovies(results.results)
                    setCurrentPage(1)
                    setIsLoading(false)
                } catch (error) {
                    console.error(error)
                    setHasError(true)
                } finally {
                    timeoutId = null
                }
            }, 3000)
        }
    }

    const renderMovieList = () => {
        return popularMovies.map((movie, index) => {
            return (
                <div className={styles.MovieWrapper} key={index}>
                    <Link to={`/${movie.id}`}>
                        <div className={styles.MovieTitle}>{movie.title}</div>
                        <img className={styles.MovieImage} src={`${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`} alt="Movie Poster" />
                        <div className={styles.MovieDate}>{movie.release_date}</div>
                        <div className={styles.MovieRate}>{movie.vote_average}</div>
                    </Link>
                </div>
            )
        })
    }

    return (
        <div className={styles.App}>
            <div className={styles.MovieSearchContainer}>
                <input
                    type="text"
                    placeholder="Search Movies..."
                    className={styles.MovieSearchInput}
                    value={searchTerm}
                    onChange={handleSearch}
                />
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
    )
}
