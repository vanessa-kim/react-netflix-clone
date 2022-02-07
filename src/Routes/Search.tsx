import { useLayoutEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useNavigate, useMatch } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { searchKeyword } from '../atoms';
import { useQuery } from "react-query";
import { getTvSearch, IMovie, getMovieSearch } from "../api";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../utils";
import ModalMovie from '../Components/ModalMovie';
import ModalTv from '../Components/ModalTv';

const Loader = styled.div`
  font-size: 24px;
`;

const ResultWrap = styled.div`
  padding: 100px 50px 50px;
`;

const Title = styled.h3`
  position: relative;
  font-size: 30px;
  font-weight: 600;
  top: -10px;

  span {
    color: ${props => props.theme.red}
  }
`;

const SubTitle= styled.h4`
  font-size: 20px;
  font-weight: 600;
  padding: 50px 0 12px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 100%;
`;

const Box = styled(motion.div)`
  position: relative;
  height: 200px;
  background-color: ${props => props.theme.black.lighter};
  padding: 0 0 50px;
  cursor: pointer;

  h5 {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    padding: 10px 20px;

    span {
      display: inline-block;
      width: calc(100% - 40px);
      overflow: hidden;
      height: 20px;
    }

    div {
      display: flex;
      align-items: center;
      height: 30px;
      font-size: 14px;
      background-color: green;
      padding: 3px 10px;
      border-radius: 8px;

      &.movie {
        background-color: #df8100;
      }
    }
  }
`;

const BoxImage = styled.div<{ bgImage: string }>`
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #2F2F2F, transparent), url(${props => props.bgImage});
  background-size: cover;
  background-position: center center;
`;

function Search() {
  const location = useLocation();
  const paramsKeyword = new URLSearchParams(location.search).get('keyword');
  const [keyword, setKeyword] = useRecoilState(searchKeyword);  

  useLayoutEffect(()=>{
    paramsKeyword && setKeyword(paramsKeyword);
    tvRefetch();
    movieRefetch();
  }, [paramsKeyword]);

  const { isLoading:tvLoading, data: tvSearchResult, refetch:tvRefetch } = useQuery(
    ['search', 'tv'],
    () =>getTvSearch(keyword),
    { enabled: !!keyword },
  );

  const { isLoading: movieLoading, data: movieSearchReslt, refetch:movieRefetch } = useQuery(
    ['search', 'movie'],
    () => getMovieSearch(keyword),
    { enabled: !!keyword },
  );

  const navigate = useNavigate();
  const onBoxClicked = (movieId: string) => {
    navigate(`/search/${movieId}`);
  }
  const searcheMatch = useMatch('/search/:contentId');
  
  const clickedMovie = searcheMatch?.params.contentId && 
                        movieSearchReslt?.results?.find((item: IMovie) => item.id + '' === searcheMatch?.params.contentId + '');
  const clickedTv = searcheMatch?.params.contentId && 
                    tvSearchResult?.results?.find((item: IMovie) => item.id + '' === searcheMatch?.params.contentId + '');
  return (
    <>
    <ResultWrap>
      <Title><span>'{keyword}'</span> 검색 결과</Title>
      <SubTitle>Movie 검색 결과</SubTitle>
      {
        <Row>
          { movieSearchReslt?.results?.map((item: IMovie) => (
              <Box 
                key={item.id}
                layoutId={item?.id+''}
                onClick={() => onBoxClicked(item.id+'')}
              >
                <BoxImage bgImage={makeImagePath(item.backdrop_path, 'w500')}/>
                <h5>
                  <span>{item.title}</span>
                  <div className="movie">Movie</div>
                </h5>
              </Box>
          ))}
        </Row>
      }

      <SubTitle>TV 시리즈 검색 결과</SubTitle>
      { tvLoading ? <Loader>Loading...</Loader> :  (
        <>
          <Row>
            { tvSearchResult?.results?.map((item: IMovie) => (
                <Box 
                  key={item.id}
                  layoutId={item?.id+''}
                  onClick={() => onBoxClicked(item.id+'')}
                >
                  <BoxImage bgImage={makeImagePath(item.backdrop_path, 'w500')}/>
                  <h5>
                    <span>{item.name}</span>
                    <div>TV</div>
                  </h5>
                </Box>
            ))}
          </Row>
        </>
      )}
      
      <AnimatePresence>
        { clickedMovie ? <ModalMovie {...clickedMovie} /> : null }
        { clickedTv ? <ModalTv {...clickedTv} /> : null }
      </AnimatePresence>
    </ResultWrap>
    </>
  );
}
export default Search;