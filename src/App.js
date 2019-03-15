import React, { Component } from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import Navbar from "./components/navbar.js";
import devpage from "./pages/devpage";
import TyphoonPageView from './pages/typhoon/view';
import WeatherPage from './pages/weather/page';
import SatellitePage from './pages/satellite/page';
import NoticeBanner from './components/notice';
import 'bulma/css/bulma.css';
import './styles/main.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <link href="https://cdn.bootcss.com/font-awesome/5.7.2/css/all.min.css" rel="stylesheet" />
          <Navbar/>
          <NoticeBanner/>
          <main className='bd-main'>
            <div className='container'>
              <Switch>
                <Route path='/' exact component={devpage} />
                <Route path='/weather' component={() => <WeatherPage/>} />
                <Redirect from='/windygram' to='/weather' />
                <Route path='/satellite' component={() => <SatellitePage/>} />
                <Route path='/about' component={devpage} />
              </Switch>
            </div>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
