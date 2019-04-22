import classnames from 'classnames';
import React, { Component } from 'react';
import ImageBox from '../../components/imagebox';
import Axios from '../../components/_axios';
import './model.css';


function CommonModal(props) {
  return (
    <div className={classnames({'modal':true, 'is-active':props.active})}>
      <div className='modal-background' onClick={props.close}></div>
      <div className='modal-content modal-bottom'>
        <div className='box better-border'>
          <div className='content'>
            <h4 className='modal-heading'>{props.heading}</h4>
            <div className='buttons'>
              {props.entries.map((item, i) => (
                <span className={classnames({
                  'button':true, 'is-rounded':true, 'is-small':true,
                  'is-theme-colored':true, 'is-active': item === props.activeEntry
                })} key={i.toString()} onClick={() => {props.select(item, i)}}>{item.toUpperCase()}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button className='modal-close is-large' aria-label='close' onClick={props.close}></button>
    </div>
  );
}

export default class ModelPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      models: ['ecmwf'],
      regions: ['china', 'asia'],
      codes: [{'code': 'GPT', 'name': '850hPa Temp & Wind'}],
      modelsel: 'ecmwf',
      regionsel: 'asia',
      codesel: 'GPT',
      namesel: '850hPa Temp & Wind',
      status: [{'time':'', 'ticks':[], 'pending':[], 'updating':false}],
      timesel: '',
      timeidx: 0,
      loaded: [],
      activeHour: 0,
      iterating: false,
      modelModal: false,
      regionModal: false,
      codeModal: false
    }

    this.iterating_timer = null;
    this.updating_timer = null;

    this.moveActiveHour = this.moveActiveHour.bind(this);
    this.update = this.update.bind(this);
    this.loadImages = this.loadImages.bind(this);
    this.getImagePath = this.getImagePath.bind(this);
    this.refreshStatus = this.refreshStatus.bind(this);
  }

  componentDidMount() {
    Axios.post(
      '/action/model/regions',
      {}
    ).then(res => {
      this.setState({regions: res.data.regions})
    });
    Axios.post(
      '/action/model/codes',
      {model: this.state.modelsel, region: this.state.regionsel}
    ).then(res => {
      this.setState({codes: res.data})
    });
    Axios.post(
      '/action/model/status',
      {model: this.state.modelsel, region: this.state.regionsel, code: this.state.codesel}
    ).then(res => {
      this.setState({status: res.data, timesel: res.data[0].time});
      this.loadImages();
    });
    if (this.state.status[this.state.timeidx].updating) setInterval(this.update, 1000*60);
  }

  moveActiveHour(move, cycle) {
    if (this.state.status.length === 0) return;
    let nowTicks = this.state.status[this.state.timeidx].ticks;
    let hourIndex = nowTicks.indexOf(this.state.activeHour);
    if (hourIndex === 0 && move === -1) return;
    if (hourIndex === nowTicks.length-1 && move === 1) {
      if (cycle) this.setState({activeHour: nowTicks[0]});
      return;
    }
    this.setState({activeHour: nowTicks[hourIndex+move]});
  }

  refreshStatus(model, region, code) {
    const modelsel = model || this.state.modelsel;
    const regionsel = region || this.state.regionsel;
    const codesel = code || this.state.codesel;
    Axios.post(
      '/action/model/status',
      {model: modelsel, region: regionsel, code: codesel}
    ).then(res => {
      if (res.data[this.state.timeidx].pending.includes(this.state.activeHour)) this.setState({activeHour: 0});
      this.setState({status: res.data});
      this.loadImages();
    });
  }

  update() {
    if (!this.state.status[this.state.timeidx].updating) {
      clearInterval(this.updating_timer);
      this.updating_timer = null;
      return;
    }
    this.refreshStatus();
  }

  loadImages() {
    const status = this.state.status[this.state.timeidx];
    for (let i = 0; i < status.ticks.length; i++) {
      if (!this.state.loaded.includes(status.ticks[i])) {
        const img = new Image();
        img.src = this.getImagePath(this.state.modelsel, this.state.timesel,
          this.state.codesel, this.state.regionsel, status.ticks[i]);
        img.onload = () => {
          this.setState(prev => ({loaded: [...prev.loaded, status.ticks[i]]}));
          this.loadImages();
        };
        break;
      }
    }
  }

  getImagePath(model, time, code, region, hour) {
    if (time === '') return '';
    return `/media/model/${model}/${time}/${code}_${region}_${hour}.png`;
  }

  render() {
    const imgSrc = this.getImagePath(this.state.modelsel, this.state.timesel,
      this.state.codesel, this.state.regionsel, this.state.activeHour);
    const status = this.state.status[this.state.timeidx];
    if (this.state.iterating && this.iterating_timer === null) this.iterating_timer = setInterval(() => {this.moveActiveHour(1, true)}, 600);
    else if (!this.state.iterating && this.iterating_timer !== null) {clearInterval(this.iterating_timer); this.iterating_timer = null;}
    return (
      <div className='columns'>
        <div className='column is-9'>
          <ImageBox src={imgSrc} width='100%' />
        </div>
        <div className='column is-3'>
          <div className='height-container'>
            <div className='level is-mobile'>
              <div className='level-left'>
                <div className='level-item'>
                  <div className='buttons'>
                    <span
                      className='button btn-hour'
                      onClick={() => {this.moveActiveHour(-1)}}
                    ><i className='fas fa-chevron-left'></i></span>
                    <span
                      className='button btn-hour'
                      onClick={() => {this.setState(prev => ({iterating: !prev.iterating}))}}
                    ><i className={classnames({
                      'fas':true, 'fa-play':!this.state.iterating, 'fa-pause':this.state.iterating
                    })}></i></span>
                    <span
                      className='button btn-hour'
                      onClick={() => {this.moveActiveHour(1)}}
                    ><i className='fas fa-chevron-right'></i></span>
                  </div>
                </div>
              </div>
            </div>
            <div className='buttons'>{
              [...status.ticks, ...status.pending].sort((a, b) => a - b).map(hr => (
                <span
                  key={hr.toString()}
                  className={classnames({
                    'button': true, 'btn-hour': true, 'btn-active': hr === this.state.activeHour,
                    'btn-loaded': this.state.loaded.includes(hr)
                  })}
                  onClick={() => {if (!status.pending.includes(hr)) this.setState({activeHour: hr});}}
                  disabled={status.pending.includes(hr)}
                >{hr}</span>
              ))
            }</div>
          </div>
          <div className='select is-rounded' style={{marginBottom:'1.5rem'}}>
            <select onChange={(event) => {
              const newidx = event.target.selectedIndex;
              if (this.state.status[newidx].pending.includes(this.state.activeHour)) this.setState({activeHour: 0});
              this.setState({timesel: event.target.value, timeidx: newidx, loaded:[]}, this.loadImages);
            }}>
              {this.state.status.map(item => (
                <option selected={item.time===this.state.timesel}>{item.time}</option>
              ))}
            </select>
          </div>
          <div className='buttons'>
            <span className='button is-rounded is-theme-colored' onClick={() => {this.setState({modelModal: true})}}><i className='fas fa-globe navbar-icon'></i>{this.state.modelsel.toUpperCase()}</span>
            <span className='button is-rounded is-theme-colored' onClick={() => {this.setState({regionModal: true})}}><i className='fas fa-location-arrow navbar-icon'></i>{this.state.regionsel.toUpperCase()}</span>
            <span className='button is-rounded is-theme-colored' onClick={() => {this.setState({codeModal: true})}}><i className='fas fa-sun navbar-icon'></i>{this.state.namesel}</span>
          </div>
        </div>
        <CommonModal
          heading='Select Model'
          entries={this.state.models}
          activeEntry={this.state.modelsel}
          select={item => {
            if (this.state.modelsel === item) return;
            this.setState({modelsel:item, modelModal:false, loaded: []});
            this.refreshStatus(item);
          }}
          active={this.state.modelModal}
          close={() => {this.setState({modelModal:false})}}
        />
        <CommonModal
          heading='Select Plot'
          entries={this.state.codes.map(item => item.name)}
          activeEntry={this.state.namesel}
          select={(item, i) => {
            if (this.state.namesel === item) return;
            this.setState({namesel:item, codesel:this.state.codes[i].name, codeModal:false, loaded:[]});
            this.refreshStatus(null, null, item);
          }}
          active={this.state.codeModal}
          close={() => {this.setState({codeModal:false})}}
        />
        <div className={classnames({'modal':true, 'is-active':this.state.regionModal})}>
          <div className='modal-background' onClick={() => {this.setState({'regionModal':false})}}></div>
          <div className='modal-content modal-bottom'>
            <div className='box better-border'>
              <div className='content'>
                <h4 className='modal-heading'>Select Region</h4>
                <div className='columns is-mobile is-multiline is-centered'>
                  {this.state.regions.map((region, i) => (
                    <div className='column is-narrow has-text-centered' key={i.toString()}>
                      <ImageBox
                        src={`/media/maps/${region}.png`}
                        width={128}
                      />
                      <a
                        className={classnames({
                          'button':true, 'is-rounded':true, 'is-theme-colored':true,
                          'is-small':true, 'is-active':this.state.regionsel === region
                        })}
                        style={{marginTop:'.5rem'}}
                        onClick={() => {
                          if (this.state.regionsel === region) return;
                          this.setState({regionsel:region, regionModal:false, loaded:[]});
                          this.refreshStatus(null, region);
                        }}
                      >{region.toUpperCase()}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button className='modal-close is-large' aria-label='close' onClick={() => {this.setState({'regionModal':false})}}></button>
        </div>
      </div>
    )
  }
}
