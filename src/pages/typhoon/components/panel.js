import React from 'react';

class Panel extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return ([
      <div className='level'>
        <nav className='nav-choice'>
          <p className='heading'>
            Model Run
          </p>
          <a className='is-active'>
            06/15 00Z
          </a>
          <a>
            06/14 12Z
          </a>
          <a>
            06/14 00Z
          </a>
        </nav>
      </div>,
      <div className='level'>
        <nav className='nav-choice'>
          <p className='heading'>
            Time Range
          </p>
          <a className='is-active'>
            10 days
          </a>
          <a>
            5 days
          </a>
        </nav>
      </div>
    ]);
  }
}

export default Panel;