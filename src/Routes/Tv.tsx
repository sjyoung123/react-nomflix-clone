import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { airingToday, getTvShows, IGetDatas, ratedTv } from "../api";
import { sliderDetailState } from "../atom";
import Detail from "../components/Detail";
import Loading from "../components/Loading";
import MainImg from "../components/MainImg";
import Slider from "../components/Slider";
import { Wrapper } from "./Home";

function Tv() {
  const { data: popular, isLoading: popLoading } = useQuery<IGetDatas>(
    ["tv", "popular"],
    getTvShows
  );
  const { data: airToday, isLoading: airToLoading } = useQuery<IGetDatas>(
    ["tv", "airingToday"],
    airingToday
  );

  const { data: rated, isLoading: ratedLoading } = useQuery<IGetDatas>(
    ["tv", "topRated"],
    ratedTv
  );

  const kind = useRecoilValue(sliderDetailState);

  let isLoading = popLoading || airToLoading || ratedLoading;
  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <MainImg data={popular} />
            <Slider data={popular} detail="tv" kind="인기 TV 쇼" />
            <Slider data={airToday} detail="tv" kind="방영 중인 프로그램" />
            <Slider data={rated} detail="tv" kind="평점 높은 순" />
            <Detail
              data={
                kind === "인기 TV 쇼"
                  ? popular
                  : kind === "방영 중인 프로그램"
                  ? airToday
                  : rated
              }
              detail="tv"
            />
          </>
        )}
      </Wrapper>
    </>
  );
}
export default Tv;
