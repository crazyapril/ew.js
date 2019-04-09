import React, { Component } from 'react'
import PanelList from '../../components/panellist';
import ImageBox from '../../components/imagebox';
import './satellite.css';

export default class SatellitePage extends Component {

  constructor(props) {
    super(props);

    this.imageTypes = ['VIS', 'IR', 'IR-BD', 'IR-CA', 'IR-RBTOP', 'WV-NRL'].map(val => (
      {val: val, disabled: false}
    ));

    this.state = {
      imagePath: this.getImagePath(this.imageTypes[0].val)
    };

    this.handleClick = this.handleClick.bind(this);
    this.getImagePath = this.getImagePath.bind(this);
  }

  getImagePath(imageType) {
    imageType = imageType.toLowerCase().replace('vis', 'b3').replace('ir', 'b13')
                         .replace('wv', 'b8').replace('-', '');
    if (this.props.code === 'target') return '/media/latest/sate/' + imageType + '.png';
    else return `/media/lastest/sate/${this.props.code}_${imageType}.png`;
  }

  handleClick(i, val) {
    this.setState({imagePath: this.getImagePath(val)});
  }

  render() {
    return (
      <div className='columns'>
        <div className='column is-2'>
          <PanelList
            heading='Choose image types'
            entries={this.imageTypes}
            onListChange={this.handleClick}
            initIndex={0}
          />
        </div>
        <div className='column is-8'>
          <ImageBox src={this.state.imagePath} />
        </div>
        <div className='column is-2'></div>
      </div>
    )
  }
}
