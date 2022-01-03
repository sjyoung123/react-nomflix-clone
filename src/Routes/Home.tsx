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
import Slider from "../components/Slider";
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
  font-size: 24px;
  width: 50%;
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

export const offset = 6;

function Home() {
  const { data, isLoading } = useQuery<IGetMovies>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");

  const { scrollY } = useViewportScroll();

  const onOverlayClick = () => {
    navigate(-1);
  };

  const clickedDetail =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <Banner
              bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
            >
              <Title>{data?.results[0].title}</Title>
              <Overview>{data?.results[0].overview}</Overview>
            </Banner>
            <Slider data={data} />
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
