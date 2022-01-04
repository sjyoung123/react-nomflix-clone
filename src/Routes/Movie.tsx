import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetDatas } from "../api";
import Detail from "../components/Detail";
import Loading from "../components/Loading";
import MainImg from "../components/MainImg";
import Slider from "../components/Slider";

//styeld-components
export const Wrapper = styled.div`
  background: black;
`;

function Movie() {
  const { data: nowPlaying, isLoading } = useQuery<IGetDatas>(
    ["movies", "nowPlaying"],
    getMovies
  );

  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <MainImg data={nowPlaying} />
            <Slider data={nowPlaying} detail="movies" />
            <Detail data={nowPlaying} detail="movies" />
          </>
        )}
      </Wrapper>
    </>
  );
}
export default Movie;
