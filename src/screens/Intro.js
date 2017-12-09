import React from "react";
import { compose, withState, withHandlers } from "recompose";
import * as cn from "classnames";
import { appName } from "../constants";

const renderIntro = ({ handleBtnClick, btnClass }) => (
  <div className="hero is-light is-fullheight">
    <div className="hero-body">
      <div className="container has-text-centered">
        <h1 className="title is-size-1">{appName}</h1>
        <h2 className="subtitle">crypto portfolio tracking app</h2>
        <button className={btnClass} onClick={handleBtnClick}>
          OPEN
        </button>
        <p className="is-size-5 mt-10">
          <strong>under heavy development</strong>
        </p>
      </div>
    </div>
  </div>
);

const Intro = compose(
  withState("btnClass", "setBtnClass", cn("button", "is-warning")),
  withHandlers({
    handleBtnClick: ({ setBtnClass, loadApp }) => () => {
      setBtnClass(cls => cn(cls, "is-loading"));
      loadApp();
    }
  })
)(renderIntro);

export default Intro;
