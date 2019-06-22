import classnames from 'classnames';
import React, { Component } from 'react';
import ImageBox from '../../components/imagebox';
import { Redirect, Route } from 'react-router-dom';
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

class ModelContent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      models: ['ecmwf'],
      regions: ['China', 'Asia'],
      codes: [{'code': 'GPT', 'name': '850hPa Temp & 500hPa Height', 'protected': false}],
      modelsel: this.props.match.params.model,
      regionsel: this.props.match.params.region,
      codesel: this.props.match.params.code,
      namesel: '850hPa Temp & 500hPa Height',
      status: [{'time':'', 'ticks':[], 'pending':[], 'updating':false}],
      timesel: '',
      timeidx: 0,
      loaded: [],
      activeHour: 0,
      iterating: false,
      modelModal: false,
      regionModal: false,
      codeModal: false,
      imgProtected: false
    }

    this.iterating_timer = null;
    this.updating_timer = null;

    this.moveActiveHour = this.moveActiveHour.bind(this);
    this.update = this.update.bind(this);
    this.loadImages = this.loadImages.bind(this);
    this.getImagePath = this.getImagePath.bind(this);
    this.refreshStatus = this.refreshStatus.bind(this);
    this.keydownEvent = this.keydownEvent.bind(this);
    this.urlifyRegion = this.urlifyRegion.bind(this);
  }

  componentDidMount() {
    Axios.post(
      '/action/model/regions',
      {}
    ).then(res => {
      this.setState({regions: res.data.regions});
      for (let r of res.data.regions) if (this.urlifyRegion(r) === this.state.regionsel) {
        this.setState({regionsel: r});
        break;
      }
    });
    Axios.post(
      '/action/model/codes',
      {model: this.state.modelsel, region: this.state.regionsel}
    ).then(res => {
      this.setState({codes: res.data});
      let allcodes = res.data.map(c => (c.code.toLowerCase()));
      let nowcode = this.state.codesel;
      let codeidx = allcodes.indexOf(nowcode);
      if (codeidx === -1) {
        nowcode = res.data[0].code.toLowerCase();
        this.setState({codesel: nowcode, namesel: res.data[0].name, imgProtected: res.data[0].protected});
        this.props.history.push(`/model/${this.state.modelsel}/${this.urlifyRegion(this.state.regionsel)}/${nowcode}/`);
      } else this.setState({namesel: res.data[codeidx].name, imgProtected: res.data[codeidx].protected});
      Axios.post(
        '/action/model/status',
        {model: this.state.modelsel, region: this.state.regionsel, code: nowcode}
      ).then(res => {
        this.setState({status: res.data, timesel: res.data[0].time});
        this.loadImages();
      });
    });
    document.addEventListener('keydown', this.keydownEvent, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownEvent, false);
  }

  keydownEvent(e) {
    if (e.keyCode === 37) this.moveActiveHour(-1); // left
    else if (e.keyCode === 39) this.moveActiveHour(1); // right
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
      if (res.data[this.state.timeidx].updating && this.updating_timer === null) this.updating_timer = setInterval(this.update, 1000*60);
      this.setState({status: res.data}, this.loadImages);
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
          this.state.codesel, this.state.regionsel, status.ticks[i], this.state.imgProtected);
        img.onload = () => {
          this.setState(prev => ({loaded: [...prev.loaded, status.ticks[i]]}), this.loadImages);
        };
        break;
      }
    }
  }

  urlifyRegion(region) {
    return region.replace(/ /g, '_').replace(/&/g, '').toLowerCase();
  }

  getImagePath(model, time, code, region, hour, protect) {
    if (time === '') return '';
    let s = `/model/${model}/${time}/${code.toLowerCase()}_${this.urlifyRegion(region)}_${hour}.png`;
    if (protect) return '/protected' + s;
    else return '/media' + s;
  }

  render() {
    const imgSrc = this.getImagePath(this.state.modelsel, this.state.timesel,
      this.state.codesel, this.state.regionsel, this.state.activeHour, this.state.imgProtected);
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
            this.setState({modelsel:item, modelModal:false, loaded: [], iterating:false}, this.refreshStatus);
            this.props.history.push(`/model/${item}/${this.urlifyRegion(this.state.regionsel)}/${this.state.codesel}/`);
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
            let codesel = this.state.codes[i].code.toLowerCase();
            this.setState({namesel:item, codesel:codesel, codeModal:false, loaded:[], iterating:false, imgProtected:this.state.codes[i].protected}, this.refreshStatus);
            this.props.history.push(`/model/${this.state.modelsel}/${this.urlifyRegion(this.state.regionsel)}/${codesel}/`);
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
                        src={`/media/maps/${this.urlifyRegion(region)}.png`}
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
                          this.setState({regionModal: false});
                          Axios.post(
                            '/action/model/codes',
                            {model: this.state.modelsel, region: region}
                          ).then(res => {
                            let new_state, code = res.data[0].code.toLowerCase();
                            new_state = {codesel: code, namesel: res.data[0].name, imgProtected: res.data[0].protected};
                            for (let i of res.data) {
                              if (i.code.toLowerCase() === this.state.codesel) {
                                new_state = {imgProtected: i.protected};
                                code = this.state.codesel;
                                break;
                              }
                            }
                            this.setState({codes: res.data, regionsel:region, loaded:[], iterating:false, ...new_state}, this.refreshStatus);
                            this.props.history.push(`/model/${this.state.modelsel}/${this.urlifyRegion(region)}/${code}/`);
                          });
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


export default class ModelPage extends Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <Route path={`${match.path}`} exact render={() => <Redirect to={`${match.path}ecmwf/china/gpt/`} />} />
        <Route
          path={`${match.path}:model/:region/:code/`}
          component={ModelContent}
        />
      </div>
    )
  }
}
