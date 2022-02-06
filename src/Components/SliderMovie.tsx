import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { useNavigate, useMatch } from "react-router-dom";
import { useState } from "react";
import { IGetMoviesResult } from '../api';
import { makeImagePath } from "../utils";
import { useLocation } from "react-router-dom";

const SlideWrapper = styled.div`
  position: relative;
  height: 200px;
  margin-bottom: 50px;
  width: 100%;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
  padding: 0 60px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
  font-size: 66px;
  background-image: url(${props => props.bgphoto });
  background-size: cover;
  background-position: center center;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  position: absolute;
  padding: 10px 20px;
  background-color: ${props => props.theme.black.lighter };
  opacity: 0;
  bottom: 0;
  overflow: hidden;
  h4 {
    text-align: center;
    font-size: 18px;
    width: 100%;
  }
`;

const NextBtn = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 50px;
  border: 0;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  
  svg {
    font-size 20px;
    color: #fff;
  }
`;

const PrevBtn = styled(NextBtn)`
  right: inherit;
  left: 0;
`;

const rowVariants = {
  hidden: (goBack: boolean) => ({
    x: goBack ? -window.outerWidth - 5 : window.outerWidth - 5,
  }),
  visible: {
    x: 0,
  },
  exit: (goBack: boolean) => ({
    x: goBack ? window.outerWidth - 5 : -window.outerWidth - 5,
  }),
}

const boxVariants= {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay:  0.5,
      duration: 0.3,
      type: 'tween',
    }
  }
}

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay:  0.5,
      duration: 0.3,
      type: 'tween',
    },
  }
}

const offset = 6;

function SliderMovie(data: IGetMoviesResult) {
  const location = useLocation();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [goBack, setGoBack] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving(prev => !prev);
  const increaseIndex = () => {
    if (data) {
      setGoBack(false);
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex(prev => prev === maxIndex ? 0 : prev + 1);
    }
  };
  const decreaseIndex = () => {
    if (data) {
      setGoBack(true);
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex(prev => prev === 0 ? -3 : prev - 1);
    }
  };
  let isHome = location && location?.pathname + '' === '/';
  const onBoxClicked = (movieId: string) => {
    navigate( isHome ? 
              `/movies/${movieId}` : 
              `/tv/${movieId}`
            );
  }
  return (
    <>
      <SlideWrapper>
        <AnimatePresence 
          initial={false}
          onExitComplete={toggleLeaving}
        >
          <Row 
            custom={goBack}
            variants={rowVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit"
            transition={{ type: 'tween', duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map(movie => (
                <Box 
                  layoutId={movie.id+''}
                  key={movie.id}
                  whileHover="hover"
                  initial="normal"
                  transition={{delay:  0.5, type: 'tween',}}
                  variants={boxVariants}
                  bgphoto={makeImagePath(movie.backdrop_path, 'w500')}
                  onClick={() => onBoxClicked(movie.id + '')}
                >
                  <Info variants={infoVariants}>
                    <h4>{isHome ? movie?.title : movie?.name}</h4>
                  </Info>
                </Box>
            ))}
          </Row>
        </AnimatePresence>
        {index !== 0 ? <PrevBtn onClick={decreaseIndex}>
          <BsChevronLeft />
        </PrevBtn> : null }
        <NextBtn onClick={increaseIndex}>
          <BsChevronRight />
        </NextBtn>
      </SlideWrapper>
    </>
  );
}

export default SliderMovie;