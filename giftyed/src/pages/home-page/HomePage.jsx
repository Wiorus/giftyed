import React from "react";
import "./HomePage.scss";
import HomeInfo from "../../components/homeInfo/HomeInfo";
import corner from "../../utils/corner.png";
import gift from "../../utils/gift.png";
const HomePage = () => {
  return (
    <div className="HomePage">
      <img className="HomePage__cornerImg" src={corner} alt="corner" />
      <div className="HomePage__content">
        <div className="HomePage__content-info">
          <HomeInfo />
        </div>
        <img className="HomePage__content-giftImg" src={gift} alt="gift" />
      </div>
    </div>
  );
};

export default HomePage;
