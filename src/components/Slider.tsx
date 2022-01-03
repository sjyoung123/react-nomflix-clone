import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetMovies } from "../api";
import { offset } from "../Routes/Home";
import { makeImagePath } from "../utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

//styled-components
const SliderSC = styled.div`
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
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.bgphoto});
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

const Next = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 2%;
  height: 200px;
  background-color: transparent;
  z-index: 99;
  right: 0;
  svg {
    cursor: pointer;
    font-size: 28px;
  }
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

//interface
interface ISlider {
  data?: IGetMovies;
}

const infoVariants: Variants = {
  hover: { opacity: 1, transition: { delay: 0.3, type: "tween" } },
};

function Slider({ data }: ISlider) {
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
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

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1; // -1 -> Banner
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }
  };

  return (
    <>
      <SliderSC>
        <Next>
          <FontAwesomeIcon onClick={increaseIndex} icon={faChevronRight} />
        </Next>
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
      </SliderSC>
    </>
  );
}

export default Slider;
