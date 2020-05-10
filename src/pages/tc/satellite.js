import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PanelList from '../../components/panellist';
import ImageBox from '../../components/imagebox';
import './satellite.css';
import Axios from '../../components/_axios';
import classnames from 'classnames';
import { withStore } from '@spyna/react-store';

class SatellitePage extends Component {

  constructor(props) {
    super(props);

    this.imageTypes = ['VIS', 'IR', 'IR-BD', 'IR-CA', 'IR-RBTOP', 'WV-NRL', 'WV-SSD'].map(val => (
      {val: val, disabled: false}
    ));
    this.iteratorTimer = null;
    this.loopInterval = 100;
    this.loopPause = 500;
    this.preloaded = [];
    this.loading = [];

    this.state = {
      imageType: this.imageTypes[0].val,
      loop: false,
      loopping: true,
      loopIndex: 0,
      loopIndexMax: 30,
      loopImages: [],
      loopAllImages: {},
      loopPaused: false,
      creatingVideo: false,
      sateAreas: []
    };

    this.handleClick = this.handleClick.bind(this);
    this.toggleLoop = this.toggleLoop.bind(this);
    this.moveActive = this.moveActive.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
    this.keydownEvent = this.keydownEvent.bind(this);
    this.createVideo = this.createVideo.bind(this);
  }

  handleClick(i, val) {
    this.setState({imageType: val});
    if (this.state.loop) {
      this.setState({loopIndex: 0, loopImages: this.state.loopAllImages[val], loopIndexMax: this.state.loopAllImages[val].length});
      this.preloaded = [];
      this.loading = [];
    }
  }

  toggleLoop() {
    let nowstate = !this.state.loop;
    if (nowstate) {
      this.preloaded = [];
      this.loading = [];
      Axios.post(
        '/action/typhoon/images',
        {storm: this.props.code}
      ).then(res => {
        if (res.data['IR'].length == 0) return;
        let images = res.data[this.state.imageType];
        this.setState({loop: nowstate, loopping: true, loopIndex: 0,
          loopAllImages: res.data, loopImages: images, loopIndexMax: images.length});
        this.iteratorTimer = setInterval(() => {this.moveActive(1, true)}, this.loopInterval);
        document.addEventListener('keydown', this.keydownEvent, false);
      })
    } else {
      this.setState({loop: nowstate});
      clearInterval(this.iteratorTimer);
      document.removeEventListener('keydown', this.keydownEvent, false);
    }
  }

  moveActive(direction, cycle) {
    if (this.state.loopPaused) return;
    let imagesLen = this.state.loopImages.length;
    if (imagesLen === 0) return;
    if (direction === 1 && this.state.loopIndex === imagesLen - 1) {
      if (cycle) {
        setTimeout(() => {
          this.setState({loopPaused: false});
          if (this.state.loopping) this.setState({loopIndex:0});
        }, this.loopPause);
        this.setState({loopPaused: true});
      }
      return;
    }
    if (direction === -1 && this.state.loopIndex === 0) return;
    this.setState({loopIndex: this.state.loopIndex + direction});
  }

  onSliderChange(e) {
    this.setState({loopIndex: parseInt(e.target.value)});
  }

  keydownEvent(e) {
    if (e.keyCode === 37) this.moveActive(-1, false); // left
    else if (e.keyCode === 39) this.moveActive(1, false); // right
  }

  createVideo() {
    this.setState({creatingVideo:true});
    var windowsRef = window.open();
    Axios.post(
      '/action/typhoon/createvideo',
      {storm: this.props.code, type:this.state.imageType}
    ).then(res => {
      this.setState({creatingVideo:false});
      if (res.data.url === '') return;
      windowsRef.location = '/media/' + res.data.url;
    })
  }

  componentDidMount() {
    Axios.get(
      '/action/typhoon/areas'
    ).then(response => {
      this.setState({
        sateAreas: response.data.areas
      })
    });
  }

  render() {
    let vis_band;
    if (this.props.code === 'target') vis_band = 'b3';
    else vis_band = 'b1';
    let imagePath, imageType = this.state.imageType.toLowerCase().replace('vis', vis_band)
      .replace('ir', 'b13').replace('wv', 'b8').replace('-', '');
    if (!this.state.loop) {
      if (this.props.code === 'target') imagePath = '/media/latest/sate/' + imageType + '.png';
      else imagePath = `/media/latest/sate/${this.props.code}_${imageType}.png`;
    } else {
      imagePath = '/media/sate/' + this.state.loopImages[this.state.loopIndex];
      if (this.loading.length <= 5 && this.preloaded.indexOf(imagePath) === -1) {
        const img = new Image();
        img.src = imagePath;
        this.loading.push(imagePath);
        img.onload = () => {this.loading.splice(this.loading.indexOf(imagePath, 1));this.preloaded.push(imagePath);}
      }

    }
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
          { this.state.sateAreas.length > 0 &&
          <div className='nav-choice-sate is-grouped is-grouped-multiline tags'>
            {this.state.sateAreas.map((item, i) =>
              <a
                key={i.toString()}
                className={classnames({'is-active': (this.props.code === 'target' && item.target) || this.props.code === item.code})}
                onClick={() => {
                  if ((this.props.code === 'target' && item.target) || this.props.code === item.code) return;
                  if (item.target) this.props.history.push('/typhoon/satellite/target/');
                  else this.props.history.push(`/typhoon/satellite/${item.code}/`);
                }}
              >{item.code}.{item.name}</a>
            )}
          </div>
          }
          { this.state.sateAreas.length === 0 &&
          <div className='notification' style={{borderRadius:'500px', fontFamily:'Lato'}}>
            Currently no area of interest to watch.
          </div>
          }
          { this.state.loop &&
          <div className='columns'>
            <div className='column is-narrow'>
              <div className='buttons is-centered has-addons'>
                <span className='button is-rounded is-success' onClick={() => {this.moveActive(-1, false)}}><i className='fa fa-chevron-left fa-lg'></i></span>
                <span
                  className='button is-rounded is-success'
                  onClick={() => {
                    let looppingNow = !this.state.loopping;
                    this.setState({loopping: looppingNow});
                    if (looppingNow) this.iteratorTimer = setInterval(() => {this.moveActive(1, true)}, this.loopInterval);
                    else clearInterval(this.iteratorTimer);
                  }}
                ><i className={classnames({
                  'fa':true,
                  'fa-pause':this.state.loopping,
                  'fa-play':!this.state.loopping,
                  'fa-lg':true
                })}></i></span>
                <span className='button is-rounded is-success' onClick={() => {this.moveActive(1, false)}}><i className='fa fa-chevron-right fa-lg'></i></span>
              </div>
            </div>
            <div className='column is-fullwidth'>
              <input class="slider" step="1" min="0" max={this.state.loopIndexMax-1} type="range" id="slider" value={this.state.loopIndex} onChange={this.onSliderChange} />
            </div>
          </div>
          }
          <ImageBox src={imagePath} />
        </div>
        <div className='column is-2'>
          <div className='buttons'>
            <button className='button is-fullwidth is-rounded is-success is-outlined' onClick={this.toggleLoop}>
              { !this.state.loop &&
                <><i className='fa fa-play navbar-icon'></i>Loop</>
              }
              { this.state.loop &&
                <><i className='fa fa-square navbar-icon'></i>Latest</>
              }
            </button>
            { this.props.store.get('userPlevel') > 0 && (
              <button className={classnames({
                'button':true, 'is-rounded':true, 'is-loading':this.state.creatingVideo, 'is-fullwidth':true
              })} onClick={this.createVideo}>
                <i className='fa fa-file-video navbar-icon'></i>Create Video
              </button>
            )}
            <button className='button is-fullwidth is-text is-small is-rounded' onClick={() => {
              let gifPath;
              if (this.props.code === 'target') gifPath = '/media/latest/sate/' + imageType + '.gif';
              else gifPath = `/media/latest/sate/${this.props.code}_${imageType}.gif`;
              window.open(gifPath);
            }}>View GIF Loop</button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(withStore(SatellitePage));