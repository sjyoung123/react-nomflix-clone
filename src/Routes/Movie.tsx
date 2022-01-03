import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetDatas } from "../api";
import Detail from "../components/Detail";
import MainImg from "../components/MainImg";
import Slider from "../components/Slider";

//styeld-components
export const Wrapper = styled.div`
  background: black;
`;

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Movie() {
  const { data, isLoading } = useQuery<IGetDatas>(
    ["movies", "nowPlaying"],
    getMovies
  );

  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <MainImg data={data} />
            <Slider data={data} detail="movies" />
            <Detail data={data} detail="movies" />
          </>
        )}
      </Wrapper>
    </>
  );
}
export default Movie;
