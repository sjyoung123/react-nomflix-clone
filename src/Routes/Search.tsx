import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { IGetDatas, searchMovie, searchTv } from "../api";
import { sliderDetailState } from "../atom";
import Detail from "../components/Detail";
import Loading from "../components/Loading";
import Slider from "../components/Slider";

const Wrapper = styled.div`
  margin-top: 350px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 250px;
`;

function Search() {
  const location = useLocation();
  const kind = useRecoilValue(sliderDetailState);
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: movieData, isLoading: movieLoading } = useQuery<IGetDatas>(
    ["search", "movie"],
    () => searchMovie(keyword)
  );

  const { data: tvData, isLoading: tvLoading } = useQuery(
    ["search", "tv"],
    () => searchTv(keyword)
  );

  let isLoading = movieLoading || tvLoading;

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Wrapper style={{ marginTop: 350 }}>
            <Slider
              data={movieData}
              kind={`${keyword}로 찾은 영화`}
              detail="search"
            />
            <Slider
              data={tvData}
              kind={`${keyword}로 찾은 TV쇼`}
              detail="search"
            />
          </Wrapper>
          <Detail
            data={kind === `${keyword}로 찾은 영화` ? movieData : tvData}
            detail="search"
          />
        </>
      )}
    </>
  );
}
export default Search;
