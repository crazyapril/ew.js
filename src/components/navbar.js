import classnames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';
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
            <nav className='navbar has-shadow is-spaced' role='navigation' aria-label='main navigation'>
                <div className='container big'>
                    <div className='navbar-brand'>
                        <a className='navbar-item' href='#'>
                            <img src={logo} alt='EASTERLYWAVE'/>
                        </a>
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
                            <NavLink className='navbar-item' to='/model' activeClassName='is-active'>Model</NavLink>
                            <NavLink className='navbar-item' to='/typhoon' activeClassName='is-active'>Typhoon</NavLink>
                            <NavLink className='navbar-item' to='/weather' activeClassName='is-active'>Weather</NavLink>
                            <NavLink className='navbar-item' to='/about' activeClassName='is-active'>About</NavLink>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

}

export default Navbar;
