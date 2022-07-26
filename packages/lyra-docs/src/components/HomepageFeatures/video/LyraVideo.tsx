import React from "react";
import PropTypes from "prop-types";

// Import CSS
import style from "./video.module.css"

// utils
import { YoutubeProps } from "../../../../utils/types";

const LyraVideo = ({ embedId }: YoutubeProps): JSX.Element => (
  <div className={style.youtube}>
    <iframe
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

LyraVideo.propTypes = {
  embedId: PropTypes.string.isRequired
};

export default LyraVideo;