import React, { Component } from 'react';
import ImageBox from '../../components/imagebox';
import PanelList from '../../components/panellist';
import Axios from '../../components/_axios';

export default class EnsemblePage extends Component {

  constructor(props) {
    super(props);

    this.basin_short = ['WPAC', 'NATL', 'EPAC', 'NIO', 'SIO', 'AUS', 'EASTASIA'];
    this.basin_full = ['Western Pacific', 'Northern Atlantic', 'Eastern Pacific',
      'N. Indian Ocean', 'S. Indian Ocean', 'Southern Pacific', 'East Asian Seas'];

    this.state = {
      storms: [],
      timesel: 0,
      nowtime: '----',
      stormsel: this.basin_full[0],
      stormidx: 0
    }

    this.getSelectEntries = this.getSelectEntries.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this);
    this.getImagePath = this.getImagePath.bind(this);
  }

  componentDidMount() {
    Axios.post(
      '/action/typhoon/ecens',
      {}
    ).then(response => {
      this.setState({
        storms: response.data.data,
        nowtime: response.data.data[0].basetime
      })
    });
  }

  getSelectEntries() {
    let entries;
    entries = this.basin_full;
    if (this.state.storms.length > 0) entries = [...entries,
      ...this.state.storms[this.state.timesel].storms];
    return entries.map(val => ({val: val, disabled: false}));
  }

  getImagePath() {
    if (this.state.storms.length === 0) return '';
    let time = this.state.nowtime;
    let index = this.basin_full.indexOf(this.state.stormsel);
    if (index === -1) return `/media/typhoon/ecens/${time}/${this.state.stormsel}.png`;
    return `/media/typhoon/ecens/${time}/${this.basin_short[index].toLowerCase()}.png`;
  }

  handleClick(i, val) {
    this.setState({stormsel: val, stormidx: i});
  }

  handleDropdownSelect(i, val) {
    if (val === this.state.nowtime) return;
    let stormsel = this.state.stormsel;
    let allstorms = [...this.basin_full, ...this.state.storms[i].storms];
    let newidx = allstorms.indexOf(stormsel);
    if (newidx === -1) {
      stormsel = this.basin_full[0];
      newidx = 0;
    }
    this.setState({timesel:i, nowtime:val, stormsel:stormsel, stormidx:newidx});
  }

  render() {
    let entries = this.getSelectEntries(), path = this.getImagePath();
    return (
      <div className='columns'>
        <div className='column is-2'>
          <PanelList
            heading='Choose regions or storms'
            entries={entries}
            onListChange={this.handleClick}
            initIndex={this.state.stormidx}
          />
        </div>
        <div className='column is-8'>
          <ImageBox src={path} />
        </div>
        <div className='column is-2'>
          <p className='heading'>Model Runtime</p>
          <div className="dropdown is-hoverable is-fullwidth">
            <div className="dropdown-trigger">
              <button className="button" aria-haspopup="true">
                <span>{this.state.nowtime}</span>
                <span className="icon is-small">
                  <i className="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div className="dropdown-menu" role="menu">
              <div className="dropdown-content">
                {this.state.storms.map((obj, i) => (
                  <a
                    className="dropdown-item"
                    key={obj.basetime}
                    onClick={() => {this.handleDropdownSelect(i, obj.basetime)}}
                  >{obj.basetime}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
