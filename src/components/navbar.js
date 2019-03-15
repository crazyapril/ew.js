import classnames from 'classnames';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './styles/navbar.css';
import logo from '../easterlywave.png';

class Navbar extends React.Component {

  constructor (props) {
    super(props);
    this.state = {toggleOn: false};

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState(prev => ({
      toggleOn: !prev.toggleOn
    }));
  }

  render() {
    return (
      <nav className='navbar has-shadow is-spaced' aria-label='main navigation'>
        <div className='container big'>
          <div className='navbar-brand'>
            <Link className='navbar-item' to='/home'>
              <img src={logo} alt='EASTERLYWAVE'/>
            </Link>
            <div className={classnames({
              'navbar-burger': true,
              'burger': true,
              'is-active': this.state.toggleOn
            })} data-target='burgerTarget' onClick={this.toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div id='burgerTarget' className={classnames({
            'navbar-menu':true,
            'is-active':this.state.toggleOn
            })}>
            <div className='navbar-start'>
              <NavLink className='navbar-item' to='/weather' activeClassName='is-active'>
                <span className='navbar-icon has-text-danger'><i className='fas fa-umbrella'></i></span>Weather
              </NavLink>
              <NavLink className='navbar-item' to='/satellite' activeClassName='is-active'>
                <span className='navbar-icon has-text-primary'><i className='fas fa-satellite'></i></span>Satellite
              </NavLink>
              <NavLink className='navbar-item' to='/about' activeClassName='is-active'>
                <span className='navbar-icon has-text-info'><i className='fas fa-lightbulb'></i></span>About
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    );
  }

}

export default Navbar;
