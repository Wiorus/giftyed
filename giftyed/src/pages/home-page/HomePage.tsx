import React from "react";
import "./HomePage.scss";
import HomeInfo from "../../components/homeInfo/HomeInfo";
import corner from "../../utils/corner.png";
import gift from "../../utils/gift.png";
import Navbar from "../../components/navbar/Navbar";

const HomePage: React.FC = () => {
  return (
    <div className="HomePage">
      <img className="HomePage__cornerImg" src={corner} alt="corner" />
      <Navbar />
      <div className="HomePage__content">
        <div className="HomePage__content-info">
          <HomeInfo />
        </div>
        <div className="HomePage__content-shadow"></div>
        <img className="HomePage__content-giftImg" src={gift} alt="gift" />
      </div>
    </div>
  );
};

export default HomePage;
