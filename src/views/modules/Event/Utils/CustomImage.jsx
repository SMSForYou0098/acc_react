import React from 'react';
import { Image } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CustomImage = ({ 
  src, 
  alt = "Image", 
  width = "100%", 
  height = "auto",
  className = "",
  thumbnail = false,
  rounded = false,
  fluid = true,
  style = {}
}) => {
  const openImageInNewTab = () => {
    window.open(src, '_blank');
  };

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`cursor-pointer ${className}`}
        thumbnail={thumbnail}
        rounded={rounded}
        fluid={fluid}
        style={{ 
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out',
          ...style
        }}
        onClick={openImageInNewTab}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      />
    </>
  );
};

CustomImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  thumbnail: PropTypes.bool,
  rounded: PropTypes.bool,
  fluid: PropTypes.bool,
  style: PropTypes.object
};

export default CustomImage;