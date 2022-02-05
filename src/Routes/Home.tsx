import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getMovies, IGetDatas, ratedMovies, upcomingMovies } from "../api";
import { sliderDetailState } from "../atom";
import Detail from "../components/Detail";
import Loading from "../components/Loading";
import MainImg from "../components/MainImg";
import Slider from "../components/Slider";

export const offset = 6;

export const Wrapper = styled.div`
  background: black;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 250px;
`;

function Home() {
  const { data: nowPlaying, isLoading: nowLoading } = useQuery<IGetDatas>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const { data: topRated, isLoading: ratedLoading } = useQuery<IGetDatas>(
    ["movies", "topRated"],
    ratedMovies
  );

  const { data: upcoming, isLoading: upLoading } = useQuery<IGetDatas>(
    ["movies", "upcoming"],
    upcomingMovies
  );

  const kind = useRecoilValue(sliderDetailState);

  let isLoading = nowLoading || ratedLoading || upLoading;

  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <MainImg data={nowPlaying} />
            <Slider data={nowPlaying} kind="NOW PLAYING" />

            <Slider data={topRated} kind="TOP RATED" />

            <Slider data={upcoming} kind="UPCOMING" />
            <Detail
              data={
                kind === "NOW PLAYING"
                  ? nowPlaying
                  : kind === "TOP RATED"
                  ? topRated
                  : upcoming
              }
            />
          </>
        )}
      </Wrapper>
    </>
  );
}
export default Home;
