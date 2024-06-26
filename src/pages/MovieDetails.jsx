import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../api';
import styles from './MovieDetails.module.css';

export default function MovieDetails() {
    const { movieId } = useParams(); // Extract movie ID from URL parameter
    const [movieDetails, setMovieDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setIsLoading(true);
                const details = await getMovieDetails(movieId);
                setMovieDetails(details);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setHasError(true);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    const renderMovieDetails = () => {
        if (isLoading) {
            return <div className={styles.LoadingMessage}>Loading movie details...</div>;
        }

        if (hasError) {
            return <div className={styles.ErrorMessage}>An error occurred. Please try again.</div>;
        }

        if (!movieDetails) {
            return null;
        }

        const { title, overview, poster_path, release_date, vote_average, genres, production_companies } = movieDetails;

        return (
            <div className={styles.MovieDetailsContainer}>
                <div className={styles.MovieDetailsPoster}>
                    <img src={`${process.env.REACT_APP_BASEIMGURL}/${poster_path}`} alt="Movie Poster" />
                </div>
                <div className={styles.MovieDetailsInfo}>
                    <h1>{title}</h1>
                    <p className={styles.MovieDetailsOverview}>{overview}</p>

                    <div className={styles.MovieDetailsMeta}>
                        <span>Release Date: {release_date}</span>
                        <span>Vote Average: {vote_average}</span>
                        {genres && genres.length > 0 && (
                            <div className={styles.MovieDetailsGenres}>
                                <span>Genres:</span>
                                {genres.map((genre) => (
                                    <span key={genre.id}>{genre.name}, </span>
                                ))}
                            </div>
                        )}
                        {production_companies && production_companies.length > 0 && (
                            <div className={styles.MovieDetailsCompanies}>
                                <span>Production Companies:</span>
                                {production_companies.map((company) => (
                                    <span key={company.id}>{company.name}, </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.MovieDetailsPage}>
            {renderMovieDetails()}
        </div>
    );
}
