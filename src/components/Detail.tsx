import {
  AnimatePresence,
  motion,
  MotionValue,
  useViewportScroll,
} from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetDatas } from "../api";
import { makeImagePath } from "../utility";

//styled-components
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const DetailContainer = styled(motion.div)<{
  scrolly: MotionValue<number>;
}>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  top: ${(props) => props.scrolly.get() + 50}px;
  left: 0;
  right: 0;
  margin: 0 auto;
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
`;

//interface
interface IDetail {
  data?: IGetDatas;
  detail: string;
}

function Detail({ data, detail }: IDetail) {
  const { scrollY } = useViewportScroll();

  const navigate = useNavigate();
  const detailMatch = useMatch(`/${detail}/:id`);

  const onOverlayClick = () => {
    navigate(-1);
  };

  const clickedDetail =
    detailMatch?.params.id &&
    data?.results.find((detail) => String(detail.id) === detailMatch.params.id);
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
                  <DetailTitle>{clickedDetail.title}</DetailTitle>
                  <DetailOverview>{clickedDetail.overview}</DetailOverview>
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
