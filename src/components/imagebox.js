import React from 'react';
import PropTypes from 'prop-types';

function ImageBox (props) {
  return (
    <div>
      <img
        src={props.src}
        width={props.width ? props.width : '100%'}
        alt={''}
        style={{display:'block', margin:'0 auto'}}
      />
      { props.isFailed &&
        <h5 style={{color: 'red'}}>{props.message}</h5>
      }
    </div>
  )
}

ImageBox.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.number,
  message: PropTypes.string,
  isFailed: PropTypes.bool
}

export default ImageBox;
