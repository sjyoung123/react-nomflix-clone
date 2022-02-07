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
            <Slider data={nowPlaying} kind="상영중인 영화" />

            <Slider data={topRated} kind="평점 높은 순" />

            <Slider data={upcoming} kind="개봉 예정" />

            <Detail
              data={
                kind === "상영중인 영화"
                  ? nowPlaying
                  : kind === "평점 높은 순"
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
