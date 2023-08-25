import React, { Fragment, useState } from "react";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import "./Images.css";

const Images = (props) => {
  const [current, setCurrent] = useState(0);
  const images = JSON.parse(props.images);
  const length = images.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(images) || images.length <= 0) {
    return null;
  }

  return (
    <Fragment>
      <div className="slider">
        {images.length > 1 && (
          <FaArrowAltCircleLeft className="left-arrow" onClick={prevSlide} />
        )}
        {images.map((slide, index) => {
          return (
            <div
              className={index === current ? "slide active" : "slide"}
              key={index}
            >
              {index === current && (
                <img src={slide} alt="image" className="image" />
              )}
            </div>
          );
        })}
        {images.length > 1 && (
          <FaArrowAltCircleRight className="right-arrow" onClick={nextSlide} />
        )}
      </div>

      <div className="small-image-box">
        {images.map((item, index) => (
          <img
            onClick={() => setCurrent(index)}
            className={index === current ? "current-image" : ""}
            key={index}
            src={item}
          />
        ))}
      </div>
    </Fragment>
  );
};

export default Images;
