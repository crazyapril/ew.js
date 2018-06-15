import React from 'react';
import image from '../img.png';

class TyphoonCards extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return ([
      <div className='column is-one-third-desktop is-half-mobile'>
        <div className='card ty-card'>
          <div className='card-image'>
            <figure className='image is-4by3'>
              <img src={ image } alt='Placeholder'/>
            </figure>
          </div>
          <div className='card-content is-danger'>
            <div className='content'>
              WP05 EWINIAR
            </div>
          </div>
        </div>
      </div>,
      <div className='column is-one-third-desktop is-half-mobile'>
        <div className='card ty-card is-danger'>
          <div className='card-image'>
            <figure className='image is-4by3'>
              <img src={ image } alt='Placeholder'/>
            </figure>
          </div>
          <div className='card-content'>
            <div className='content'>
              WP08
            </div>
          </div>
        </div>
      </div>,
      <div className='column is-one-third-desktop is-half-mobile'>
        <div className='card ty-card is-danger'>
          <div className='card-image'>
            <figure className='image is-4by3'>
              <img src={ image } alt='Placeholder'/>
            </figure>
          </div>
          <div className='card-content'>
            <div className='content'>
              WP99
            </div>
          </div>
        </div>
      </div>,
      <div className='column is-one-third-desktop is-half-mobile'>
        <div className='card ty-card is-danger'>
          <div className='card-image'>
            <figure className='image is-4by3'>
              <img src={ image } alt='Placeholder'/>
            </figure>
          </div>
          <div className='card-content'>
            <div className='content'>
              AL90
            </div>
          </div>
        </div>
      </div>,
    ])
  }
}

export default TyphoonCards;
