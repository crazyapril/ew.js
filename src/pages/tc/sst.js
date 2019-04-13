import React, { Component } from 'react';
import ImageBox from '../../components/imagebox';
import PanelList from '../../components/panellist';
import Axios from '../../components/_axios';

export default class SSTPage extends Component {

  constructor(props) {
    super(props);

    this.regions = ['Western Pacific','Northern Atlantic','Eastern Pacific',
      'N. Indian Ocean','S. Indian Ocean','Southern Pacific','East Asia','Micronesia'];
    this.regionshort = ['wpac', 'natl', 'epac', 'nio', 'sio', 'aus', 'eastasia',
      'micronesia'];

    this.state = {
      region: this.regions[0],
      times: [],
      nowtime: '---'
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this);
    this.setTime = this.setTime.bind(this);
    this.setLatest = this.setLatest.bind(this);
  }

  componentDidMount() {
    Axios.post(
      '/action/typhoon/sst',
      {}
    ).then(response => {
      this.setState({
        times: response.data.times,
        nowtime: response.data.times[0]
      })
    });
  }

  handleClick(i, val) {
    this.setState({region: val});
  }

  handleDropdownSelect(i, val) {
    this.setState({nowtime: val});
  }

  setTime(i) {
    let timeix = this.state.times.indexOf(this.state.nowtime);
    if (timeix === -1) return;
    if (timeix === 0 && i === -1) return;
    if (timeix === this.state.times.length-1 && i === 1) return;
    this.setState({nowtime: this.state.times[timeix+i]});
  }

  setLatest() {
    if (this.state.times.length === 0) return;
    this.setState({nowtime: this.state.times[0]});
  }

  render() {
    let entries = this.regions.map(val => ({val: val, disabled: false}));
    let path, reg = this.regionshort[this.regions.indexOf(this.state.region)];
    if (this.state.nowtime === '---') path = '';
    else path = `/media/typhoon/sst/${this.state.nowtime}/${reg}.png`;
    return (
      <div className='columns'>
        <div className='column is-2'>
          <PanelList
            heading='Choose regions'
            entries={entries}
            onListChange={this.handleClick}
            initIndex={0}
          />
        </div>
        <div className='column is-8'>
          <ImageBox src={path} />
        </div>
        <div className='column is-2'>
          <p className='heading'>Select time</p>
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
                {this.state.times.map((obj, i) => (
                  <a
                    className="dropdown-item"
                    key={i.toString()}
                    onClick={() => {this.handleDropdownSelect(i, obj)}}
                  >{obj}</a>
                ))}
              </div>
            </div>
          </div>
          <div className='field has-addons' style={{marginTop: '.5rem', width: '100%'}}>
            <p className='control'>
              <a className='button is-rounded' onClick={() => {this.setTime(-1)}}>
                <span class="icon is-small"><i class="fas fa-angle-double-left"></i></span>
              </a>
            </p>
            <p className='control'>
              <a className='button' onClick={() => {this.setLatest()}}>
                <span>Latest</span>
              </a>
            </p>
            <p className='control'>
              <a className='button is-rounded' onClick={() => {this.setTime(1)}}>
                <span class="icon is-small"><i class="fas fa-angle-double-right"></i></span>
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

