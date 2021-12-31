const API_KEY = "97cedad43bd4ca832c9ecd9de8a27f3c";

const BASE_URL = "https://api.themoviedb.org";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMovies {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export const getMovies = async () => {
  return await (
    await fetch(
      `${BASE_URL}/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=kr`
    )
  ).json();
};
