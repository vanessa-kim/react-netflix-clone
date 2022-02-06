import { useLocation } from "react-router-dom";

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('keyword');
  console.log(keyword);
  return (
    <>
    메롱<br/>
    메롱<br/>
    메롱<br/>
    메롱<br/>
    메롱<br/>
    </>
  );
}
export default Search;