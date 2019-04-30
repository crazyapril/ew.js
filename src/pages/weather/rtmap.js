import React, { Component } from 'react'
import PanelList from '../../components/panellist';
import ImageBox from '../../components/imagebox';


export default class RealTimeMapPage extends Component {

  constructor(props) {
    super(props);

    this.areas = ['中国', '华南', '华东', '华北', '东南', '华中', '东北', '云贵', '川渝', '晋陕', '甘青', '新疆', '西藏'];
    this.areaKeys = ['china', 'south', 'mideast', 'north', 'midsouth', 'central', 'northeast', 'southwest', 'midwest', 'shaanxi', 'qinghai', 'xinjiang', 'tibet'];

    this.state = {
      area: this.areas[0]
    };
  }

  render() {
    const entries = this.areas.map(val => ({val: val, disabled: false}));
    let imagePath;
    if (this.state.area === '') imagePath = '';
    else imagePath = `/media/latest/weather/realtime/temp_${this.areaKeys[this.areas.indexOf(this.state.area)]}.png`;
    return (
      <div className='columns'>
        <div className='column is-2'>
          <PanelList
            heading='整点温度-选择区域'
            entries={entries}
            onListChange={(i, val) => {this.setState({area: ''}, () => {this.setState({area: val})})}}
            initIndex={0}
          />
        </div>
        <div className='column is-10'>
        <ImageBox src={imagePath} />
        </div>
      </div>
    )
  }
}
