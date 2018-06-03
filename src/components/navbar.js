import classnames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';

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
            <nav className='navbar is-info' role='navigation' aria-label='main navigation'>
                <div className='navbar-brand'>
                    <a className='navbar-item' href='#'>EASTERLYWAVE</a>
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
                        <NavLink className='navbar-item' to='/model'>Model</NavLink>
                        <NavLink className='navbar-item' to='/typhoon'>Typhoon</NavLink>
                        <NavLink className='navbar-item' to='/weather'>Weather</NavLink>
                        <NavLink className='navbar-item' to='/about'>About</NavLink>
                    </div>
                </div>
            </nav>
        );
    }

}

export default Navbar;
