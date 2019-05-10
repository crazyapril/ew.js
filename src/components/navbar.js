import classnames from 'classnames';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './styles/navbar.css';
import Axios from '../components/_axios';
import logo from '../easterlywave.png';

class Navbar extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      toggleOn: false,
      loginModal: false,
      logined: false,
      loginError: false,
      loginMessage: '',
      logining: false,
      loginedUser: '',
      loginUsername: '',
      loginPassword: ''
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggleMenu() {
    this.setState(prev => ({
      toggleOn: !prev.toggleOn
    }));
  }

  login() {
    if (this.state.loginUsername === '' || this.state.loginPassword === '') {
      this.setState({loginError:true, loginMessage:'Username or password should not be empty.'})
      return;
    }
    this.setState({logining: true})
    Axios.post(
      '/action/user/login',
      {username: this.state.loginUsername, password: this.state.loginPassword}
    ).then(res => {
      this.setState({logining: false})
      if (res.data.logined) this.setState({loginModal:false, logined:true, loginedUser:res.data.username, loginError:false})
      else this.setState({loginError:true, loginMessage:'Wrong username or password.'});
    })
  }

  logout() {
    Axios.post(
      '/action/user/logout',
      {}
    ).then(res => {
      this.setState({logined:false, loginedUser:''})
    })
  }

  componentDidMount() {
    Axios.post(
      '/action/user/check',
      {}
    ).then(res => {
      if (res.data.logined) this.setState({logined:true, loginedUser:res.data.username})
    })
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
              <div className='navbar-item has-dropdown is-hoverable'>
                <NavLink className='navbar-item' to='/weather/' activeClassName='is-active'>
                  <span className='navbar-icon has-text-danger'><i className='fas fa-umbrella'></i></span>Weather
                  <span><i className='fas fa-angle-down navbar-icon' style={{marginLeft: '8px'}}></i></span>
                </NavLink>
                <div className='navbar-dropdown'>
                  <NavLink className='navbar-item' to='/weather/'>ECMWF Time Series</NavLink>
                  <NavLink className='navbar-item' to='/weather/realtime/'>Realtime Weather</NavLink>
                </div>
              </div>
              <div className='navbar-item has-dropdown is-hoverable'>
                <NavLink className='navbar-item' to='/typhoon/' activeClassName='is-active'>
                  <span className='navbar-icon has-text-primary'><i className='fab fa-superpowers'></i></span>
                  Typhoon
                  <span><i className='fas fa-angle-down navbar-icon' style={{marginLeft: '8px'}}></i></span>
                </NavLink>
                <div className='navbar-dropdown'>
                  <NavLink className='navbar-item' to='/typhoon/'>Current Storms</NavLink>
                  <NavLink className='navbar-item' to='/typhoon/ensemble/'>ECMWF Ensemble</NavLink>
                  <NavLink className='navbar-item' to='/typhoon/sst/'>Sea Surface Temperature</NavLink>
                  <NavLink className='navbar-item' to='/typhoon/satellite/target/'>H-8 Target Area Imagery</NavLink>
                </div>
              </div>
              <NavLink className='navbar-item' to='/model/' activeClassName='is-active'>
                <span className='navbar-icon has-text-info'><i className='fas fa-globe-asia'></i></span>Model
              </NavLink>
            </div>
            <div className='navbar-end'>
              { !this.state.logined && (
                <div className='navbar-item'>
                  <a className='button is-rounded' onClick={() => {this.setState({loginModal: true, loginError: false})}}>
                    <span className='navbar-icon'><i className='fas fa-plus'></i></span>Login
                  </a>
                </div>
              )}
              { this.state.logined && (
                <div className='navbar-item is-hoverable has-dropdown'>
                  <a className='navbar-item'>
                    <span className='navbar-icon'><i className='fas fa-user-circle'></i></span>
                    { this.state.loginedUser }
                    <span><i className='fas fa-angle-down navbar-icon' style={{marginLeft: '8px'}}></i></span>
                  </a>
                  <div className='navbar-dropdown'>
                    <a className='navbar-item' onClick={() => {this.logout()}}>Logout</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={classnames({'modal': true, 'is-active':this.state.loginModal})}>
          <div className='modal-background' onClick={() => {this.setState({loginModal: false})}}></div>
          <div className='modal-content' style={{width:'30%', minWidth:'320px'}}>
            <div className='box'>
              <h3 className='title is-size-4' style={{fontFamily:'Lato'}}>Login</h3>
              <div className="field">
                <label className="label">Username</label>
                <p className="control is-expanded has-icons-left">
                  <input className='input' type="text" onChange={e => {this.setState({loginUsername: e.target.value})}} value={this.state.loginUsername} />
                  <span className="icon is-small is-left">
                    <i className="fas fa-user"></i>
                  </span>
                </p>
                { this.state.loginError && (
                  <p className='help is-danger'>{ this.state.loginMessage }</p>
                )}
              </div>
              <div className="field">
                <label className="label">Password</label>
                <p className="control is-expanded has-icons-left">
                  <input className='input' type="password" onChange={e => {this.setState({loginPassword: e.target.value})}} value={this.state.loginPassword} />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                </p>
              </div>
              <div className='has-text-centered is-fullwidth' style={{marginTop:'2rem'}}>
                <button className={classnames({
                  'button': true, 'is-rounded': true, 'is-theme-colored': true,
                  'is-fullwidth': true, 'is-loading': this.state.logining
                })} onClick={() => {this.login()}}>Login</button>
              </div>
            </div>
          </div>
          <button className='modal-close is-large' aira-label='close' onClick={() => {this.setState({loginModal: false})}}></button>
        </div>
      </nav>
    );
  }

}

export default Navbar;
