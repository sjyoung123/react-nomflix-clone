import { useQuery } from "react-query";
import { getTvShows } from "../api";
import Detail from "../components/Detail";
import Loading from "../components/Loading";
import MainImg from "../components/MainImg";
import Slider from "../components/Slider";
import { Wrapper } from "./Movie";

function Tv() {
  const { data: popular, isLoading } = useQuery(["tv", "popular"], getTvShows);
  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <MainImg data={popular} />
            <Slider data={popular} detail="tv" />
            <Detail data={popular} detail="tv" />
          </>
        )}
      </Wrapper>
    </>
  );
}
export default Tv;
