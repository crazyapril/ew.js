import React, { Component } from 'react';
import classnames from 'classnames';
import Axios from './_axios';
import './styles/notice.css';

export default class NoticeBanner extends Component {

  constructor(props) {
    super(props)

    this.state = {
      notices: []
    }

    this.removeNotice = this.removeNotice.bind(this);
  }

  noticeTypeToClass(type) {
    if (type === 1) return 'is-success';
    else if (type === 2) return 'is-info';
    else if (type === 3) return 'is-danger';
  }

  removeNotice(i) {
    let notices = this.state.notices;
    notices[i] = Object.assign(notices[i], {closed:true});
    this.setState(notices);
  }

  componentDidMount() {
    Axios.post(
      '/action/notices',
      {},
    ).then(response => {
      this.setState(response.data.notices);
    });
  }

  render() {
    return ([
      this.state.notices.map((item, i) => item.closed ? null :
        <div className='container is-fullhd' key={i.toString()}>
          <div className={classnames(['notification', this.noticeTypeToClass(item.type)])}>
            <a className={classnames(['is-small', 'is-pulled-right', 'is-inverted',
              this.noticeTypeToClass(item.type)])} onClick={() => this.removeNotice(i)}>
              <i className='fas fa-times'></i>
            </a>
            {item.content}
          </div>
        </div>
      )
    ]);
  }
}
