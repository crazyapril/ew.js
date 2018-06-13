import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Navbar from "./components/navbar.js";
import devpage from "./pages/devpage";
import TyphoonPageView from './pages/typhoon/view';
import 'bulma/css/bulma.css';
import './styles/main.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar/>
          <main className='bd-main'>
            <div className='container'>
              <Switch>
                <Route path='/model' component={devpage} />
                <Route path='/typhoon' component={TyphoonPageView} />
                <Route path='/weather' component={devpage} />
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
