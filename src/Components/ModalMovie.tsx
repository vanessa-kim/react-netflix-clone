import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useNavigate, useMatch } from "react-router-dom";
import { makeImagePath } from "../utils";
import styled from "styled-components";
import { IMovie, getMoviesGenre, IGenres, IGenre, getMoviesCredits } from '../api';
import { useQuery } from "react-query";
import { BsPlusLg, BsHandThumbsUp, BsHandThumbsDown } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw; 
  height:80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${props => props.theme.black.darker};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 500px;
`;

const BigTitle = styled.h3`
  color: ${props => props.theme.white.lighter};
  font-size: 32px;
  font-weight: 600;
  position: relative;
  top: -60px;
  padding: 10px 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BigOverview = styled.p`
  display: -webkit-box;
  height: 70px;
  padding: 0px 50px;
  word-break: keep-all;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 24px;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  color: ${(props) => props.theme.white.lighter };
`;

const Genres = styled.ul`
  position: relative;
  top: -26px;
  display: flex;
  padding: 5px 50px;

  li {
    font-size: 12px;
    padding-right: 7px;
  }
`;

const OverviewTitle = styled.h4`
  font-size: 12px;
  color: ${props => props.theme.white.veryDark};
  padding-right: 10px; 
  min-width: 38px;
`;

const CastList = styled(Genres)`
  width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  li {
    white-space: nowrap;
  }
`;

const Tags = styled.div`
  position: relative;
  top: -50px;
  left: 50px;
`;

const Year = styled.div`
  display: inline;
  padding: 5px 10px;
  font-size: 15px;
  font-weight: 600;
  background-color: #df8100;
  border-radius: 8px;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
`;

const Vote = styled(Year)`
  background-color: green;
  margin-left: 5px;
`;

const ThumbsGroup = styled.div`
  position: absolute;
  top: 495px;
  right: 50px;
  display: flex;
  align-items: center;
`;

const ThumbBtn = styled.button`
  width: 50px;
  height: 50px;
  background-color: transparent;
  border-radius: 30px;
  border: 2px solid white;
  cursor: pointer;
  opacity: 0.8;
  margin-left: 8px;
  
  svg {
    color: white;
    font-size: 26px;
  }

  &:hover {
    opacity: 1;
  }
  
  &:active {
    opacity: 0.5;
  }

  &:first-child svg{
    font-size: 20px;
  }
`;

function ModalMovie(clickedMovie?: IMovie ) {
  const path = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useViewportScroll();
  const bigMovieMatch = useMatch('/movies/:movieId');
  const [id, setId] = useState('');
  const { isLoading, data } = useQuery<IGenres>(
    ['genre', 'movies'],
    getMoviesGenre
  );
  const {isLoading:castLoading, data: casts} = useQuery(
    ['credit', 'movie'],
    () => getMoviesCredits(clickedMovie?.id)
  );

  useEffect(()=>{
    let pathId = path?.pathname?.split('/')[2];
    pathId && setId(pathId);
  }, [path]);

  let genreList = clickedMovie?.genre_ids.map(genre => {
    return data?.genres?.find((item: IGenre) => +item.id === +genre);
  });
  const onOverlayClick = () => {
    navigate('/')
  };
  return (
    <>
      <Overlay 
        onClick={onOverlayClick} 
        animate={{ opacity: 0.5, }}
        exit={{ opacity: 0 }}
      />
      <BigMovie
        layoutId={bigMovieMatch?.params.movieId || id}
        style={{ top: scrollY.get() + 100 }}
      >
        { clickedMovie && (
          <>
            <BigCover style={{
              backgroundImage: `
                linear-gradient(to top, #181818, transparent),
                url(${makeImagePath(clickedMovie.backdrop_path, 'w500')})
              `
            }} />
            <BigTitle>{ clickedMovie.title }</BigTitle>
            <Tags>
              <Year>{ clickedMovie?.release_date?.split('-')[0] }
              </Year>
              <Vote>평점: {clickedMovie?.vote_average}</Vote>
            </Tags>
            <ThumbsGroup>
              <ThumbBtn>
                <BsPlusLg />
              </ThumbBtn>
              <ThumbBtn>
                <BsHandThumbsUp />
              </ThumbBtn>
              <ThumbBtn>
                <BsHandThumbsDown />
              </ThumbBtn>
            </ThumbsGroup>
            <Genres>
              <OverviewTitle>장르:</OverviewTitle>
              {genreList && genreList.map((props: any, index) => (
                <li key={index}>
                  {props?.name}
                  {genreList && index === genreList?.length - 1 ? null: ','}
                </li>
              ))}
            </Genres>
            <CastList>
              <OverviewTitle>출연:</OverviewTitle>
              {casts && casts.cast && casts.cast.length > 0 && casts.cast.slice(0, 3).map((cast: any, index: number) => (
                <li key={index}>
                  {cast?.name}
                  {cast && index === cast?.length - 1 ? null: ','}
                </li>
              ))}
            </CastList>
            <BigOverview>{clickedMovie.overview}</BigOverview>
          </>
        )}
      </BigMovie>
    </>
  );
}

export default ModalMovie;