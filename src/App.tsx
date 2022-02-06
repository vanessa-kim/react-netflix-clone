import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Routes/Home';
import Tv from './Routes/Tv';
import Search from './Routes/Search';
import MyList from './Routes/MyList';
import Header from './Components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/tv*" element={<Tv />} />
        <Route path="/search"element={<Search />} />
        <Route path="/mylist"element={<MyList />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
