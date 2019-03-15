import React from 'react';
import Autocomplete from 'react-autocomplete';
import ImageBox from './../../components/imagebox';
import classnames from 'classnames';
import Axios from './../../components/_axios';
import './weather.css';

class WeatherPage extends React.Component {

  constructor (props) {
    super(props);
    this.initMessage = [{tip: '输入站点名称、WMO站号、拼音或经纬度如“20.00,125.00”来查询当地天气。',
      data:'0'}];
    this.state = {
      value: '',
      items: this.initMessage,
      requesting: false,
      prevQuery: '',
      imgSrc: '',
      imgIsFailed: false,
      imgMessage: '未知原因错误'
    }
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputSelect = this.onInputSelect.bind(this);
  }

  onInputChange(e, query) {
    this.setState({value: e.target.value});
    if (query === '' || query === ' ' || query === undefined) {
      this.setState({items: this.initMessage});
      return;
    };
    Axios.post(
      '/action/weather/search',
      {content: query},
    ).then(response => {
      const suggestions = response.data.suggestions;
      if (suggestions.length) this.setState({items: suggestions});
      else this.setState({items: this.initMessage});
    });
  }

  onInputSelect(query, item) {
    if (query === '' || query === ' ' || query === undefined || query === '0') return;
    if (query === this.state.prevQuery) return;
    this.setState({requesting: true, imgSrc: '', value: query, imgIsFailed: false});
    Axios.post(
      '/action/weather/plot',
      {content: query}
    ).then(response => {
      if (response.data.status !== 0) this.setState({requesting: false, imgIsFailed: true, prevQuery: query});
      else this.setState({requesting: false, imgIsFailed: false, imgSrc: response.data.src, prevQuery: query});
    });
  }

  render() {
    return (
      <div>
        <div className='columns'>
          <div className='column is-one-quarter'></div>
          <div className='column is-half'>
            <div className='content has-text-grey has-text-centered'>
              <p className='is-dark'></p>
            </div>
          </div>
        </div>
        <div className='columns'>
          <div className='column is-one-quarter'></div>
          <div className='column is-half'>
            <div className='field has-addons'>
              <div className='control is-expanded'>
                <Autocomplete
                  getItemValue={(item) => item.data}
                  renderItem={(item, isHighlighted) =>
                    <div style={{
                      background: isHighlighted ? 'lightgray' : 'white',
                      padding: '3px 9px'
                    }} key={item.data}>
                      { item.tip ? item.tip : item.data + ' ' + item.value }
                    </div>
                  }
                  items={this.state.items}
                  renderInput={(props) =>
                    <input className='input is-rounded' type='text' placeholder='支持全国2443个国家站' {...props} />
                  }
                  onChange={this.onInputChange}
                  onSelect={this.onInputSelect}
                  value={this.state.value}
                />
              </div>
              <div className='control'>
                <a
                  onClick={() => {this.onInputSelect(this.state.value, null)}}
                  className={classnames({
                    'button': true,
                    'is-danger': true,
                    'is-rounded': true,
                    'is-loading': this.state.requesting
                  })}
                ><i className='fas fa-umbrella'></i></a>
              </div>
            </div>
          </div>
          <div className='column is-one-quarter'></div>
        </div>
        <div className='columns col-pad'></div>
        <div className='columns'>
          <div className='column is-12'>
            <ImageBox src={this.state.imgSrc} isFailed={this.state.imgIsFailed} message={this.state.imgMessage} />
          </div>
        </div>
      </div>
    )
  }
}

export default WeatherPage;
