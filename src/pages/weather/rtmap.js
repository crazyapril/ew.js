import React, { Component } from 'react'
import PanelList from '../../components/panellist';
import ImageBox from '../../components/imagebox';


function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

export default class RealTimeMapPage extends Component {

  constructor(props) {
    super(props);

    this.areas = ['中国', '华南', '华东', '华北', '东南', '台灣', '华中', '东北', '云贵', '川渝', '晋陕', '甘青', '新疆', '西藏'];
    this.areaKeys = ['china', 'south', 'mideast', 'north', 'midsouth', 'taiwan', 'central', 'northeast', 'southwest', 'midwest', 'shaanxi', 'qinghai', 'xinjiang', 'tibet'];

    this.state = {
      area: this.areas[0],
      timesel: null
    };
  }

  render() {
    const entries = this.areas.map(val => ({val: val, disabled: false}));
    let imagePath;
    if (this.state.area === '') imagePath = '';
    else {
      imagePath = `/protected/latest/weather/realtime/temp_${this.areaKeys[this.areas.indexOf(this.state.area)]}`;
      if (this.state.timesel === '最新') imagePath = imagePath + '.png';
      else imagePath = imagePath + '_' + pad(this.state.timesel, 2) + '.png';
    }
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
          <div className='select is-rounded is-small'>
            <select onChange={(event) => {
              const newidx = event.target.selectedIndex;
              if (newidx === 0) this.setState({timesel: '最新'});
              else this.setState({timesel: newidx - 1});
            }}>
              <option selected={this.state.timesel == '最新'}>最新</option>
              {[...Array(24).keys()].map(item => (
                <option selected={this.state.timesel == item}>{item}:00</option>
              ))}
            </select>
          </div>
          <ImageBox src={imagePath} />
        </div>
      </div>
    )
  }
}
