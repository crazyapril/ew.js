import classnames from 'classnames';
import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import ImageBox from '../../components/imagebox';
import Axios from '../../components/_axios';
import SatellitePage from './satellite';
import EnsemblePage from './ensemble';
import SSTPage from './sst';


class TCImageBox extends Component {

  constructor(props) {
    super(props);

    this.imageTypes = ['wpac', 'natl', 'epac', 'nio', 'sio', 'aus'];

    this.state = {
      imageType: this.imageTypes[0]
    }
  }

  render() {
    return (
      <div>
        <div>
          <ImageBox src={'/media/latest/typhoon/sector_'+this.state.imageType+'.png'} />
        </div>
        <div style={{margin: '0.5rem 0'}}>
          <div className='tabs is-toggle is-small is-centered'>
            <ul>
              {this.imageTypes.map(type => (
                <li className={classnames({'is-active': type === this.state.imageType})}>
                  <a onClick={() => {this.setState({imageType: type})}}>
                    <span>{type.toUpperCase()}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}


function StormEntry (props) {
  let style;
  if (props.basin === 'WPAC') style = 'is-danger';
  else if (props.basin === 'ATL') style = 'is-info';
  else if (props.basin === 'EPAC' || props.basin === 'CPAC') style = 'is-link';
  else if (props.basin === 'NIO') style = 'is-warning';
  else if (props.basin === 'SHEM' && props.code.endsWith('S')) style = 'is-success';
  else if (props.basin === 'SHEM' && props.code.endsWith('P')) style = 'is-primary';
  else style = 'is-dark';
  return (
    <div key={props.code} style={{marginBottom:'1.5rem'}}>
      <div className='level is-mobile' style={{marginBottom:'2px'}}>
        <div className='level-left'>
        <span
          className={classnames(['tag', 'is-rounded', 'level-item', 'level-margin', style])}
        >{props.basin}</span>
        <span className='is-size-6 has-text-dark'>{props.code + '.' + props.name.toUpperCase()}</span>
        </div>
        <div className='level-right'>
        <span className='is-size-7 has-text-grey-light level-margin'>{props.time}</span>
        </div>
      </div>
      <div className='span-full has-background-white-ter has-text-black'>
        <p>Wind: {props.wind} kt</p>
        <p>Pressure: {props.pressure} hPa</p>
        <p>Position: {props.latstr} {props.lonstr}</p>
        <p>
          <a href={'http://rammb.cira.colostate.edu/products/tc_realtime/storm.asp?storm_identifier='+props.code_full}><i className='fas fa-arrow-circle-right'></i> RAMMB Products</a>

          {props.is_target && (
            <Link
              to='/typhoon/satellite/target/'
              className='level-margin'
            ><i className='fas fa-satellite'></i> Target Area Imagery</Link>)}

          {props.in_service && (
            <Link
              to={`/typhoon/satellite/${props.code}/`}
              className='level-margin'
            ><i className='fas fa-satellite'></i> Floater Imagery</Link>)}
        </p>
      </div>
    </div>
  )
}



class TCIndexPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      storms: []
    }
  }

  componentDidMount() {
    Axios.post(
      '/action/typhoon/sector',
      {}
    ).then(response => {
      this.setState({storms: response.data.storms});
    });
  }

  render() {
    return (
      <div className='columns'>
        <div className='column is-6'>
          <TCImageBox />
        </div>
        <div className='column is-6'>
          {this.state.storms.map(storm => (
            <StormEntry {...storm} />
          ))
          }
        </div>
      </div>
    )
  }
}


export default class TCPage extends Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <Route path={`${match.path}/`} exact component={TCIndexPage} />
        <Route
          path={`${match.path}/satellite/:code`}
          render={({match}) => (<SatellitePage code={match.params.code} />)}
        />
        <Route path={`${match.path}/ensemble`} render={() => (<EnsemblePage />)} />
        <Route path={`${match.path}/sst`} render={() => (<SSTPage />)} />
      </div>
    )
  }
}

