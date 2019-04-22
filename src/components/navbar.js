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
            <Link className='navbar-item' to='/'>
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
              <div className='navbar-item has-dropdown is-hoverable'>
                <NavLink className='navbar-item' to='/typhoon' activeClassName='is-active'>
                  <span className='navbar-icon has-text-primary'><i className='fab fa-superpowers'></i></span>
                  Typhoon
                  <span><i className='fas fa-angle-down navbar-icon' style={{marginLeft: '8px'}}></i></span>
                </NavLink>
                <div className='navbar-dropdown'>
                  <NavLink className='navbar-item' to='/typhoon'>Current Storms</NavLink>
                  <NavLink className='navbar-item' to='/typhoon/ensemble'>ECMWF Ensemble</NavLink>
                  <NavLink className='navbar-item' to='/typhoon/sst'>Sea Surface Temperature</NavLink>
                  <NavLink className='navbar-item' to='/typhoon/satellite/target'>H-8 Target Area Imagery</NavLink>
                </div>
              </div>
              <NavLink className='navbar-item' to='/model' activeClassName='is-active'>
                <span className='navbar-icon has-text-info'><i className='fas fa-globe-asia'></i></span>Model
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    );
  }

}

export default Navbar;
