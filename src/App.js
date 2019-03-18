import React, { Component } from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import Navbar from "./components/navbar.js";
import devpage from "./pages/devpage";
import page404 from "./pages/404";
import TyphoonPageView from './pages/typhoon/view';
import BlogPage from './pages/blog/page';
import Article from './pages/blog/article';
import WeatherPage from './pages/weather/page';
import SatellitePage from './pages/satellite/page';
import NoticeBanner from './components/notice';
import 'bulma/css/bulma.css';
import './styles/main.css';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      articles: [],
      moreArticle: false,
      tagFilter: '所有',
      tags: [],
      scrollY: null
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar/>
          <NoticeBanner/>
          <main className='bd-main'>
            <div className='container'>
              <Switch>
                <Route path='/home' exact component={() => <BlogPage hp={this.state} />} />
                <Route path='/weather' component={WeatherPage} />
                <Redirect from='/windygram' to='/weather' />
                <Redirect from='/' exact to='/home' />
                <Route path='/satellite' component={SatellitePage} />
                <Route path='/about' component={devpage} />
                <Route path='/blog/:pk' component={({match}) => <Article pk={match.params.pk}/>} />
                <Route component={page404} />
              </Switch>
            </div>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
