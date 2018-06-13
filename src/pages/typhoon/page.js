import React from 'react';
import Panel from './components/panel';

class TyphoonPage extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      activeStorms: [],
      time: '',
      dayRange: 10
    }
  }

  componentDidMount() {
    this.setState({
      activeStorms: [{name: 'EWINIAR', basin: 'WPAC'}],
      time: '2018/06/13 00Z'
    })
  }

  render() {
    return (
      <div className='columns'>
        <div className='column is-one-fifth'>
          <Panel/>
        </div>
        <div className='column is-four-fifths'>
        </div>
      </div>
    );
  }

}

export default TyphoonPage;