import React, { Component } from 'react';
import { createStore } from '@spyna/react-store';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import Navbar from "./components/navbar.js";
import devpage from "./pages/devpage";
import page404 from "./pages/404";
import BlogPage from './pages/blog/page';
import Article from './pages/blog/article';
import RegisterPage from './pages/register';
import ModelPage from './pages/model/page';
import WeatherPage from './pages/weather/page';
import TCPage from './pages/tc/tc';
import NoticeBanner from './components/notice';
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
                <Route path='/' exact component={() => <BlogPage hp={this.state} />} />
                <Route path='/weather/' component={WeatherPage} />
                <Route path='/typhoon/' component={TCPage} />
                <Route path='/model/' component={ModelPage} />
                <Route path='/register/' component={RegisterPage} />
                <Route path='/about/' component={devpage} />
                <Route path='/blog/:pk/' component={({match}) => <Article pk={match.params.pk}/>} />
                <Route component={page404} />
              </Switch>
            </div>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

const initialValue = {
  userLogined: false,
  userName: '',
  userPlevel: 0
}

export default createStore(App, initialValue);
