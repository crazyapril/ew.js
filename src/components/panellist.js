import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './styles/panellist.css';

class PanelList extends Component {

  constructor(props) {
    super(props);
    this.state = {
       activeIndex: props.initIndex
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(i, val) {
    if (this.props.entries[i].disabled) return;
    this.setState({activeIndex: i});
    this.props.onListChange(i, val);
  }

  render() {
    return (
      <div className='level'>
        <nav className='nav-choice'>
          <p className='heading'>{this.props.heading}</p>
          {this.props.entries.map((item, i) =>
            <a
              key={i.toString()}
              className={classnames({'is-active': i === this.state.activeIndex})}
              disabled={item.disabled}
              onClick={() => this.handleClick(i, item.val)}
            >{item.val}</a>
          )}
        </nav>
      </div>
    )
  }
}

PanelList.propTypes = {
  heading: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  onListChange: PropTypes.func.isRequired,
  initIndex: PropTypes.number
}

PanelList.defaultProps = {
  initIndex: 0
}

export default PanelList;
