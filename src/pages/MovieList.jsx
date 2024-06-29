import React, { useState, useEffect, useRef } from 'react'
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
    const [isSearch, setIsSearch] = useState(false)

    const debouncedSearchTerm = useRef('')

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

    const fetchSearchMovies = async (query) => {
        setIsLoading(true)
        debouncedSearchTerm.current = setTimeout(async () => {
            try {
                const results = await searchMovie(query, currentPage)
                setPopularMovies(prevMovies => [...prevMovies, ...results])
                setCurrentPage(prevPage => prevPage + 1)
                setIsLoading(false)
            } catch (error) {
                console.error(error)
                setHasError(true)
            }
        }, 1000)
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        const query = e.target.value
        if (query !== searchTerm) {
            setHasError(false)
            setCurrentPage(1)
        }
        setSearchTerm(query)

        clearTimeout(debouncedSearchTerm.current)

        if (query.length === 0) {
            setIsSearch(false)
            setPopularMovies([])
            setCurrentPage(1)
            await fetchPopularMovies()
        }

        if (query.length >= 3) {
            setIsSearch(true)
            setPopularMovies([])
            await fetchSearchMovies(query)
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
                next={isSearch ? fetchSearchMovies : fetchPopularMovies}
                hasMore={true}
                className={styles.MovieListContainer}
            >
                {renderMovieList()}
            </InfiniteScroll>
        </div>
    )
}
