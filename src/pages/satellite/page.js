import React, { Component } from 'react'
import PanelList from '../../components/panellist';
import ImageBox from '../../components/imagebox';
import classnames from 'classnames';
import Axios from '../../components/_axios';
import './satellite.css';

export default class SatellitePage extends Component {

  constructor(props) {
    super(props);

    this.imageTypes = ['VIS', 'IR', 'IR-BD', 'IR-CA', 'IR-RBTOP', 'WV-NRL'].map(val => (
      {val: val, disabled: false}
    ));
    this.imageTypes[0].disabled = true;

    this.state = {
      imagePath: this.getImagePath(this.imageTypes[1].val),
      serviceStatus: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.getImagePath = this.getImagePath.bind(this);
  }

  getImagePath(imageType) {
    imageType = imageType.toLowerCase().replace('ir', 'b13').replace('wv', 'b8').replace('-', '');
    return '/media/latest/sate/' + imageType + '.png';
  }

  handleClick(i, val) {
    this.setState({imagePath: this.getImagePath(val)});
  }

  componentDidMount() {
    Axios.post(
      '/action/satellite/service',
      {}
    ).then(response => {
      this.setState({serviceStatus: response.data.status});
    });
  }

  render() {
    return (
      <div className='columns'>
        <div className='column is-2'>
          <PanelList
            heading='Choose image types'
            entries={this.imageTypes}
            onListChange={this.handleClick}
            initIndex={1}
          />
        </div>
        <div className='column is-8'>
          <ImageBox src={this.state.imagePath} width={720} />
        </div>
        <div className='column is-2'>
            <div className={classnames([
              'span-full',
              'has-text-centered',
              'is-size-6',
              this.state.serviceStatus ? 'has-background-primary' : 'has-background-grey-light'
            ])}>
              <p>{this.state.serviceStatus ? 'Service ON' : 'Service OFF'}</p>
            </div>
            <div className='span-full has-background-white-ter has-text-black is-size-6'>
              <p>Himawari-8 target area imagery. The service will be turned on when active cyclone activity is observed in the Western Pacific.
              </p>
            </div>
        </div>
      </div>
    )
  }
}
