import { Outlet } from 'react-router-dom';
import './Css/App.css';
import Footer from './shared/Footer';
import Header from './shared/Header';

function App() {
  return (
    <div className="App"> 
    <Header/>
    <Outlet/>
    <Footer/>


    </div>
  );
}

export default App;
