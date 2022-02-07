import {
  AnimatePresence,
  motion,
  MotionValue,
  useViewportScroll,
} from "framer-motion";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { genreMovie, genreTv, IData, IGetDatas } from "../api";
import { makeImagePath } from "../utility";
import Loading from "./Loading";

//styled-components
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const DetailContainer = styled(motion.div)<{ scrolly: MotionValue<number> }>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  top: ${(props) => props.scrolly.get() + 50}px;
  left: 0;
  right: 0;
  margin: 0 auto;
  overflow-y: scroll;
`;

const DetailCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 65%;
`;

const DetailTitle = styled.h2`
  font-size: 28px;
  position: relative;
  padding: 10px;
  top: -50px;
`;

const DetailOverview = styled.p`
  padding: 10px;
  position: relative;
  top: -50px;
  line-height: 150%;
`;

const Genres = styled.div`
  padding: 10px;
`;

const Genre = styled.span`
  margin-right: 5px;
`;

//interface
interface IDetail {
  data?: IGetDatas;
  detail?: string;
}

function Detail({ data, detail }: IDetail) {
  const { scrollY } = useViewportScroll();

  const navigate = useNavigate();
  const detailMatch = useMatch(detail ? `/${detail}/:id` : "/:id");

  const onOverlayClick = () => {
    navigate(-1);
  };

  const clickedDetail =
    detailMatch?.params.id &&
    data?.results.find((detail) => String(detail.id) === detailMatch.params.id);

  const { data: movieGenre, isLoading: movieLoading } = useQuery<IData>(
    ["movie", "genre"],
    () => genreMovie(detailMatch?.params.id + "")
  );
  const { data: tvGenre, isLoading: tvLoading } = useQuery<IData>(
    ["tv", "genre"],
    () => genreTv(detailMatch?.params.id + "")
  );
  let isLoading = movieLoading || tvLoading;
  let genres = detail === "tv" ? tvGenre : movieGenre;

  return (
    <>
      <AnimatePresence>
        {detailMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <DetailContainer layoutId={detailMatch.params.id} scrolly={scrollY}>
              {clickedDetail && (
                <>
                  <DetailCover
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)), url(${makeImagePath(
                        clickedDetail.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  {(clickedDetail.title && (
                    <DetailTitle>{clickedDetail.title}</DetailTitle>
                  )) ||
                    (clickedDetail.name && (
                      <DetailTitle>{clickedDetail.name}</DetailTitle>
                    ))}
                  <DetailOverview>{clickedDetail.overview}</DetailOverview>
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <Genres>
                      장르:
                      {genres?.genres?.map((genre, index) => (
                        <Genre key={index}>{genre?.name}</Genre>
                      ))}
                    </Genres>
                  )}
                </>
              )}
            </DetailContainer>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
export default Detail;
