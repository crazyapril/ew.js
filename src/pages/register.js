import React, { Component } from 'react';
import classnames from 'classnames';
import './register.css';
import Axios from '../components/_axios';

export default class RegisterPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      registerStatus: 0,
      fieldStatus: {
        username: {status: 0, message: '', value: ''},
        email: {status: 0, message: '', value: ''},
        password: {status: 0, message: '', value: ''},
        password2: {status: 0, message: '', value: ''}
      }
    }

    this.usernameRegex = /^[\w.@+-]{4,16}$/gu;
    this.emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
    this.passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/g

    this.validateUsername = this.validateUsername.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.validatePassword2 = this.validatePassword2.bind(this);
    this.register = this.register.bind(this);
  }

  validateUsername (username) {
    let fieldStatus = this.state.fieldStatus;
    if (username.match(this.usernameRegex)) fieldStatus.username.status = 1;
    else fieldStatus.username.status = 2;
    fieldStatus.username.value = username;
    this.setState({fieldStatus: fieldStatus});
  }

  validateEmail (email) {
    let fieldStatus = this.state.fieldStatus;
    if (email.match(this.emailRegex)) fieldStatus.email.status = 1;
    else fieldStatus.email.status = 2;
    fieldStatus.email.value = email;
    this.setState({fieldStatus: fieldStatus});
  }

  validatePassword (password) {
    let fieldStatus = this.state.fieldStatus;
    if (password.match(this.passwordRegex)) fieldStatus.password.status = 1;
    else fieldStatus.password.status = 2;
    fieldStatus.password.value = password;
    this.setState({fieldStatus: fieldStatus});
  }

  validatePassword2 (password2) {
    let fieldStatus = this.state.fieldStatus;
    if (password2 === fieldStatus.password.value && password2 !== '') fieldStatus.password2.status = 1;
    else fieldStatus.password2.status = 2;
    fieldStatus.password2.value = password2;
    this.setState({fieldStatus: fieldStatus})
  }

  register() {
    if (this.state.registerStatus === 2) return;
    let params = {}, fieldStatus = this.state.fieldStatus;
    for (var key in this.state.fieldStatus) params[key] = this.state.fieldStatus[key].value;
    this.setState({registerStatus:1});
    Axios.post(
      '/action/user/register',
      params
    ).then(response => {
      if (response.data.success) this.setState({registerStatus: 2});
      else {
        fieldStatus[response.data.info.field].status = 2;
        fieldStatus[response.data.info.field].message = response.data.info.message;
        this.setState({registerStatus:0, fieldStatus:fieldStatus});
      }
    })
  }

  render() {
    return (
      <div className='columns is-centered'>
        <div className='column is-6'>
          <div className='box'>
            <h3 className='title is-size-4' style={{fontFamily:'Lato'}}>User Registration</h3>
            <div className="field is-horizontal">
              <div className='field-label is-normal'>
                <label className="label">Username</label>
              </div>
              <div className='field-body'>
                <div className='field'>
                  <p className="control is-expanded has-icons-left">
                    <input className={classnames({
                      'input': true,
                      'is-success': this.state.fieldStatus.username.status === 1,
                      'is-danger': this.state.fieldStatus.username.status === 2
                    })} type="text" placeholder="4~16 letters or numbers"
                    onBlur = {e => {this.validateUsername(e.target.value)}} />
                    <span className="icon is-small is-left">
                      <i className="fas fa-user"></i>
                    </span>
                  </p>
                  {this.state.fieldStatus.username.message && (
                    <p className='help is-danger'>{this.state.fieldStatus.username.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className='field-label is-normal'>
                <label className="label">Email</label>
              </div>
              <div className='field-body'>
                <div className='field'>
                  <p className="control is-expanded has-icons-left">
                    <input className={classnames({
                      'input': true,
                      'is-success': this.state.fieldStatus.email.status === 1,
                      'is-danger': this.state.fieldStatus.email.status === 2
                    })} type="text" placeholder="Valid email address"
                    onBlur={e => {this.validateEmail(e.target.value)}} />
                    <span className="icon is-small is-left">
                      <i className="fas fa-envelope"></i>
                    </span>
                  </p>
                  {this.state.fieldStatus.email.message && (
                    <p className='help is-danger'>{this.state.fieldStatus.email.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className='field-label is-normal'>
                <label className="label">Password</label>
              </div>
              <div className='field-body'>
                <div className='field'>
                  <p className="control has-icons-left">
                    <input className={classnames({
                      'input': true,
                      'is-success': this.state.fieldStatus.password.status === 1,
                      'is-danger': this.state.fieldStatus.password.status === 2
                    })} type="password" placeholder="8~20 characters, at least one letter and one number"
                    onBlur={e => {this.validatePassword(e.target.value)}} />
                    <span className="icon is-small is-left">
                      <i className="fas fa-lock"></i>
                    </span>
                  </p>
                  {this.state.fieldStatus.password.message && (
                    <p className='help is-danger'>{this.state.fieldStatus.password.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className='field-label is-normal'></div>
              <div className='field-body'>
                <div className='field'>
                  <p className="control has-icons-left">
                    <input className={classnames({
                      'input': true,
                      'is-success': this.state.fieldStatus.password2.status === 1,
                      'is-danger': this.state.fieldStatus.password2.status === 2
                    })} type="password" placeholder="Re-enter your password"
                    onBlur={e => {this.validatePassword2(e.target.value)}} />
                    <span className="icon is-small is-left">
                      <i className="fas fa-lock"></i>
                    </span>
                  </p>
                  {this.state.fieldStatus.password2.message && (
                    <p className='help is-danger'>{this.state.fieldStatus.password2.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="field is-horizontal">
              <div className='field-label is-normal'></div>
              <div className='field-body'>
                <div className='field'>
                  <p className="control">
                    <input className="checkbox" type="checkbox"/>
                    <span className='is-size-6-half' style={{paddingLeft:'3px', fontFamily:'Lato'}}>I agree to the terms of service which do not exist as of now. (joke, but you'll be informed once we've got one, of course.)</span>
                  </p>
                </div>
              </div>
            </div>
            <div className='has-text-centered is-fullwidth'>
              <button className={classnames({
                'button': true, 'is-rounded': true,
                'is-theme-colored': this.state.registerStatus <= 1,
                'is-loading': this.state.registerStatus === 1,
                'is-success': this.state.registerStatus === 2
              })} onClick={() => {this.register()}}>
                {this.state.registerStatus === 0 && 'Register'}
                {this.state.registerStatus === 2 && (
                  <p><span className='navbar-icon'><i className='fas fa-check'></i></span>OK</p>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
