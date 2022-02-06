const API_KEY = '1add63f36451eb15b1ed41d01a3d1e25';
const BASE_PATH = 'https://api.themoviedb.org/3';

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  genre_ids: string[];
  release_date: string;
  vote_average: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGenres {
  genres: []
}
export interface IGenre {
  id: number;
  name: string;
}
export interface ICredits {
  cast: ICast[];
}
export interface ICast {
  name: string;
}
export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko`)
    .then(response => response.json());
}

export function getLatestMovie() {
  return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}&language=ko`)
    .then(res => res.json());
}

export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko`)
    .then(res => res.json());
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko`)
    .then(res => res.json());
}

export function getMoviesGenre() {
  return fetch(`${BASE_PATH}/genre/movie/list?api_key=${API_KEY}&language=ko`)
    .then(res => res.json());
}

export function getMoviesCredits(movie_id: any) {
  return fetch(`${BASE_PATH}/movie/${movie_id}/credits?api_key=${API_KEY}&language=ko`)
    .then(res => res.json());
}
