import React from 'react';
import Panel from './components/panel';
import TyphoonCards from './components/cards';
import './typhoon.css';

class TyphoonPage extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      activeStormsOptions: {},
      activeStorms: [],
      modelRunOptions: [],
      modelRun: '',
      dayRangeOptions: [10, 5],
      dayRange: 10
    }
  }

  componentDidMount() {
    let activeStormsOptions = {
      '06/15 00Z': [{name: 'EWINIAR', basin: 'WPAC', code: 'WP05'}],
      '06/14 12Z': [{name: 'EWINIAR', basin: 'WPAC', code: 'WP05'}, {name: '', basin: 'WPAC', code: 'WP06'}],
      '06/14 00Z': []
    };
    let modelRunOptions = ['06/15 00Z', '06/14 12Z', '06/14 00Z'];
    let modelRun = modelRunOptions[0];
    this.setState({
      activeStormsOptions: activeStormsOptions,
      modelRunOptions: modelRunOptions,
      modelRun: modelRun,
      activeStorms: activeStormsOptions[modelRun]
    })
  }

  render() {
    return (
      <div className='columns'>
        <div className='column is-9'>
          <div className='columns is-multiline is-mobile'>
          <TyphoonCards activeStorms={this.state.activeStorms} />
          </div>
        </div>
        <div className='column is-1'></div>
        <div className='column is-2 is-narrow'>
          <Panel modelRunOptions={this.state.modelRunOptions} modelRun={this.state.modelRun} />
        </div>
      </div>
    );
  }

}

export default TyphoonPage;