import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Navbar from "./components/navbar.js";
import devpage from "./pages/devpage";
import 'bulma/css/bulma.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar/>
          <div className='container'>
            <Switch>
              <Route path='/model' component={devpage} />
              <Route path='/typhoon' component={devpage} />
              <Route path='/weather' component={devpage} />
              <Route path='/about' component={devpage} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
