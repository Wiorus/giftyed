import React from "react";
import "./HomeInfo.scss";

export default function HomeInfo() {
  return (
    <div className="home__info-element">
      <div className="home__info-element-logoName">
        <spam className="home__info-element-logoName-one">Gift</spam>
        <spam className="home__info-element-logoName-two">yed</spam>
      </div>
      <div className="home__info-element-description">
        The perfect gift for any occasion.<br></br>
        Unique gifts for special people.
      </div>
    </div>
  );
}
