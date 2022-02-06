import { AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import styled from "styled-components";
import { getTvAiring, getTvPopular, getTvRated, IMovie, IGetMoviesResult } from '../api';
import SliderTv from '../Components/SliderTv';
import ModalTv from '../Components/ModalTv';

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

const SliderTitle = styled.h3`
  position: relative;
  font-size: 30px;
  font-weight: 600;
  top: -10px;
  padding: 0 60px;
  &:first-child {
    margin-top: 100px;
  }
`;

function Tv() {
  const bigTvMatch = useMatch('/tv/:tvId');
  const { isLoading: airingLoading, data: airingTv } = useQuery(
    ['tv', 'airing'],
    getTvAiring,
  );
  const { isLoading: popularLoading, data: popularTv } = useQuery(
    ['tv', 'popular'],
    getTvPopular,
  );
  const { isLoading: ratedLoading, data: ratedTv } = useQuery(
    ['tv', 'topRate'],
    getTvRated,
  );
  
  const findCategory = (tvId: number) => {
    const categories = [
      airingTv && {...airingTv},
      popularTv && {...popularTv},
      ratedTv && {...ratedTv},
    ];
    const findResult = categories.map(category => {
      return category?.results.find((tv: IMovie) => tv?.id === tvId);
    });

    if (findResult[0]) return findResult[0];
    if (findResult[1]) return findResult[1];
    if (findResult[2]) return findResult[2];
  };
  const clickedTv = bigTvMatch?.params.tvId && 
  findCategory(+bigTvMatch?.params.tvId);
  return (
    <>
      {airingLoading || popularLoading || ratedLoading ? 'loading...' : (
        <Wrapper>
          <SliderTitle>Airing Today / 지금 상영중인 콘텐츠</SliderTitle>
          { airingTv && <SliderTv {...airingTv} /> }
          <SliderTitle>Popular /지금 상영중인 콘텐츠</SliderTitle>
          { popularTv && <SliderTv {...popularTv} /> }
          <SliderTitle>Top Rated /지금 상영중인 콘텐츠</SliderTitle>
          { popularTv && <SliderTv {...ratedTv} /> }
          <AnimatePresence>
            { bigTvMatch ? (clickedTv && <ModalTv {...clickedTv} />) : null }
          </AnimatePresence>
        </Wrapper>
      )}
    </>
  );
}
export default Tv;