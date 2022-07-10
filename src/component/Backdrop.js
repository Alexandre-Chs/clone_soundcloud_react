import React, { useEffect } from 'react';

const Backdrop = ({
  backgroundImage,
  trackIndex,
  isPlaying,
}) => {

  useEffect(() => {
   document.body.style.backgroundImage = `url('${backgroundImage}')`;
  }, [trackIndex]);

  return (
    <div />
  );
};

export default Backdrop;