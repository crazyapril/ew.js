import React from 'react';

class Panel extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return ([
      <div className='level'>
        <nav className='panel panel-full'>
          <p className='panel-heading'>
            Current Time
          </p>
          <a className='panel-block is-active'>
            2018/06/12 00Z
          </a>
        </nav>
      </div>,
      <div className='level'>
        <nav className='panel panel-full'>
          <p className='panel-heading'>
            Time Range
          </p>
          <a className='panel-block is-active'>
            10 days
          </a>
          <a className='panel-block'>
            5 days
          </a>
        </nav>
      </div>
    ]);
  }
}

export default Panel;