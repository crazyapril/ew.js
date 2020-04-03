import React, { Component } from 'react';
import classnames from 'classnames';
import Axios from 'axios';

export default class StationInfoPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      info: {},
      loading: false,
      inputValue: ''
    };

    this.onInputSelect = this.onInputSelect.bind(this);
  }

  onInputSelect(value) {
    if (value === '') return;
    this.setState({loading: true});
    Axios.post(
      '/action/weather/stationinfo',
      {search: value}
    ).then(response => {
      this.setState({info: response.data, loading: false});
    });
  }

  render() {
    return (
      <div>
        <div className='columns'>
          <div className='column is-3 is-hidden-mobile'></div>
          <div className='column is-6 box search-box'>
            <label className='search-label label is-small'>
              <span>查询站点信息、气候数据、站史记录，支持全国各国家站</span>
            </label>
            <div className='field has-addons'>
              <div className='control is-expanded'>
                <input className='input search-input' placeholder='请输入站名或站号'
                value={this.state.inputValue} onChange={e => (this.setState({inputValue:e.target.value}))}/>
              </div>
              <div class="control">
                <a class="button search-btn" onClick={() => {this.onInputSelect(this.state.inputValue)}}>
                  <i className={classnames({
                    "fa":true, "is-large":true, "fa-search":!this.state.loading,
                    "fa-asterisk":this.state.loading, "fa-spin":this.state.loading
                  })}></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        { "msg" in this.state.info && (
        <div className='columns' style={{marginTop:"5px"}}>
          <div className='column is-3 is-hidden-mobile'></div>
          <div className='column is-6 box box-card'>
            <label className='label level is-small'>
              <span className='is-danger'>提示</span>
            </label>
            <p>{this.state.info.msg}</p>
          </div>
        </div>
        )}
        { "station" in this.state.info && (
        <div className='column is-12 box box-card'>
          <label className='label level is-small'>
            <span>站点信息</span>
            <span className='is-pulled-right'>数据来源：查天气</span>
          </label>
          <div className='columns is-mobile'>
            <div className='column is-4 column-card'>
              <label className='label'><span>站名</span></label>
              <p>{this.state.info.station.name}</p>
            </div>
            <div className='column is-4 column-card'>
              <label className='label'><span>站号</span></label>
              <p>{this.state.info.station.code}</p>
            </div>
            <div className='column is-4 column-card'>
              <label className='label'><span>经纬度</span></label>
              <p>{this.state.info.station.location}</p>
            </div>
          </div>
        </div>
        )}
        { "climate" in this.state.info && this.state.info.climate.valid && (
        <div className='column is-12 box box-card'>
          <label className='label level is-small'>
            <span>气候数据</span>
            <span className='is-pulled-right'>数据来源：NMC（1980-2010年）</span>
          </label>
          <div class="table-container">
          <table className='table is-hoverable is-fullwidth table-record'>
            <thead>
              <tr>
                <th></th>
                <th>一月</th>
                <th>二月</th>
                <th>三月</th>
                <th>四月</th>
                <th>五月</th>
                <th>六月</th>
                <th>七月</th>
                <th>八月</th>
                <th>九月</th>
                <th>十月</th>
                <th>十一月</th>
                <th>十二月</th>
              </tr>
            </thead>
            <tbody>
              {this.state.info.climate.data.map(item => (
                <tr>
                  <th>{item.item}</th>
                  {item.values.map(item => (<td>{item}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        )}
        { "record" in this.state.info && this.state.info.record.valid && (
        <div className='column is-12 box box-card'>
          <label className='label level is-small'>
            <span>站史纪录</span>
            <span className='is-pulled-right'>数据未经校正，有错误请反馈</span>
          </label>
          <div class="table-container">
          <table className='table is-hoverable is-fullwidth table-record'>
            <thead>
              <tr>
                <th></th>
                {Array(10).fill().map((_, i) => (<th>#{i+1}</th>))}
              </tr>
            </thead>
            <tbody>
              {
                this.state.info.record.data.map(item => (
                  <tr>
                    <th>{item.item}</th>
                    {item.data.map(item => (<td>{item.value}<br/>({item.date})</td>))}
                  </tr>
                ))
              }
            </tbody>
          </table>
          </div>
        </div>
        )}
      </div>
    )
  }

}