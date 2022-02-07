import { AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate, useMatch } from "react-router-dom";
import styled from "styled-components";
import { IMovie, getMovies, getTopRatedMovies, getUpcomingMovies, IGetMoviesResult } from '../api';
import { makeImagePath } from "../utils";
import { BiInfoCircle } from "react-icons/bi";
import SliderMovie from '../Components/SliderMovie';
import ModalMovie from '../Components/ModalMovie';
import { useLocation } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
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
  padding: 60px 60px 135px;
  background-image: linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${props => props.bgphoto});
  background-size: cover;
  margin-bottom: -150px;
`;

const Title = styled.h2`
  font-size: 48px;
  font-weight: 600;
  margin-bottom: 20px;
  text-shadow: 0 5px 5px rgba(0, 0, 0, 0.5);
`;

const Overview = styled.p`
  font-size: 24px;
  width: 50%;
  line-height: 36px;
  margin-bottom: 20px;
  text-shadow: 0 5px 5px rgba(0, 0, 0, 0.5);
  word-break: keep-all;
`;

const SliderTitle = styled.h3`
  position: relative;
  font-size: 30px;
  font-weight: 600;
  top: -10px;
  padding: 0 60px;
`;

const DetailBtn = styled.button`
  display: flex;
  align-items: center;
  justify-contents: center;
  width: 160px;
  padding: 12px 20px;
  font-size: 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 0;
  text-align: center;
  cursor: pointer;
  
  svg {
    font-size: 24px;
    margin-right: 10px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.14);
  }
`;

interface ICategory {
  name: string;
  movies: IMovie[];
};

function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  // github.io 인 경우 path 혼선을 줄이기 위한 코드
  console.log('pathname', location.pathname.split('/'));
  if(location.pathname.split('/')[1] === 'react-netflix-clone') {
    navigate('/');
  }

  const { isLoading: nowPlayingLoading, data: nowPlayingMovies } = useQuery<IGetMoviesResult>(
    ['movies', 'nowPlaying'], 
    getMovies
  );
  const { isLoading: ratedLoading, data: topRatedMovies } = useQuery<IGetMoviesResult>(
    ['movies', 'topRated'],
    getTopRatedMovies,
  );
  const { isLoading: upcomingLoading, data: upcomingMovies} = useQuery<IGetMoviesResult>(
    ['movies', 'upcoming'],
    getUpcomingMovies,
  );

  const findCategory = (movieId: number) => {
    const categories = [
      nowPlayingMovies && {...nowPlayingMovies},
      topRatedMovies && {...topRatedMovies},
      upcomingMovies && {...upcomingMovies},
    ];
    const findResult = categories.map(category => {
      return category?.results.find(movie => movie.id === movieId);
    });

    if (findResult[0]) return findResult[0];
    if (findResult[1]) return findResult[1];
    if (findResult[2]) return findResult[2];
  };

  const bigMovieMatch = useMatch('/movies/:movieId');
  const clickedMovie = bigMovieMatch?.params.movieId && 
                       findCategory(+bigMovieMatch?.params.movieId);
  const handleBannerDetail = () => {
    navigate(`/movies/${nowPlayingMovies?.results[0].id}`);
  } 
  return (
    <Wrapper>
      { nowPlayingLoading ? <Loader>Loading...</Loader> : (
        <>
          <Banner bgphoto={makeImagePath(nowPlayingMovies?.results[0].backdrop_path || '')}>
            <Title>{nowPlayingMovies?.results[0].title}</Title>
            <Overview>{nowPlayingMovies?.results[0].overview}</Overview>
            <DetailBtn onClick={handleBannerDetail}>
              <BiInfoCircle />
              상세보기
            </DetailBtn>
          </Banner>
          <SliderTitle>지금 상영중인 콘텐츠</SliderTitle>
          { nowPlayingMovies && <SliderMovie {...nowPlayingMovies} /> }
          <SliderTitle>Top Rated Movies 오늘 한국의 TOP 10 콘텐츠</SliderTitle>
          { topRatedMovies && <SliderMovie {...topRatedMovies} />}
          <SliderTitle>Upcoming Movies 개봉 예정 콘텐츠</SliderTitle>
          { upcomingMovies && <SliderMovie {...upcomingMovies} />}
          <AnimatePresence>
            { bigMovieMatch ? (clickedMovie && <ModalMovie {...clickedMovie} />) : null }
          </AnimatePresence>
        </>
      ) }
    </Wrapper>
  );
}
export default Home;