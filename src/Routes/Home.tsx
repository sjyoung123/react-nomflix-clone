import {
  AnimatePresence,
  motion,
  MotionValue,
  useViewportScroll,
  Variants,
} from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMovies } from "../api";
import { makeImagePath } from "../utility";

//styeld-components
const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 58px;
  margin-bottom: 15px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -220px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  display: flex;
  align-items: end;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  background-color: ${(props) => props.theme.black.lighter};
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20%;
  opacity: 0;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const MovieDetailContainer = styled(motion.div)<{
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

//Variants
const rowVariants: Variants = {
  hidden: { x: window.innerWidth },
  visible: { x: 0 },
  exit: { x: -window.innerWidth },
};

const boxVariants: Variants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.3, type: "tween" },
  },
};

const infoVariants: Variants = {
  hover: { opacity: 1, transition: { delay: 0.3, type: "tween" } },
};

const offset = 6;

function Home() {
  const { data, isLoading } = useQuery<IGetMovies>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");

  const { scrollY } = useViewportScroll();

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1; // -1 -> Banner
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }
  };

  const onlyBackdropPath = (movies: IGetMovies) => {
    const copy = { ...movies };
    copy.results.forEach((movie, index) => {
      if (movie.backdrop_path === null) {
        return copy.results.splice(index, 1);
      }
    });
    return copy;
  };

  const onBoxClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClick = () => {
    navigate(-1);
  };

  const clickedDetail =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  console.log(clickedDetail);

  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Banner
              onClick={increaseIndex}
              bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
            >
              <Title>{data?.results[0].title}</Title>
              <Overview>{data?.results[0].overview}</Overview>
            </Banner>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={index}
                  transition={{ type: "tween", duration: 1 }}
                >
                  {data &&
                    { ...onlyBackdropPath(data) }.results
                      .slice(1)
                      .slice(offset * index, offset * index + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          onClick={() => {
                            onBoxClick(movie.id);
                          }}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          key={movie.id}
                          bgphoto={makeImagePath(movie.backdrop_path, "w400")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <AnimatePresence>
              {bigMovieMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                  <MovieDetailContainer
                    layoutId={bigMovieMatch.params.movieId}
                    scrolly={scrollY}
                  >
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
                        <DetailOverview>
                          {clickedDetail.overview}
                        </DetailOverview>
                      </>
                    )}
                  </MovieDetailContainer>
                </>
              ) : null}
            </AnimatePresence>
          </>
        )}
      </Wrapper>
    </>
  );
}
export default Home;
