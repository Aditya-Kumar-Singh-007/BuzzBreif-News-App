import React, { Component } from "react";
import { Link } from "react-router-dom";

import loading from "./loadrr.gif";
import darkmodeImg from "./darkmode.png";
import lightmodeImg from "./lightmode.png";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "light",
    };
  }

  render() {
    return (
      <div>
        <nav
          className={`navbar  fixed-top navbar-expand-lg navbar-${this.props.mode} `}
          style={{
            backgroundColor: this.props.mode === "dark" ? "black" : "#F7CE4C",
            color: this.props.mode === "dark" ? "white" : "black",
          }}
        >
          <div className="container-fluid">
            <Link to="/">
              <div>
                <img className="titleIcon" src={loading} alt="icon" />{" "}
              </div>
            </Link>
            <Link className="navbar-brand myFontForTitle" to="/">
              BuzzBrief
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 myFontForNavIcons">
                <li>
                  <Link
                    className="nav-link"
                    style={
                      this.props.mode === "dark"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    aria-current="page"
                    to="/"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className="nav-link"
                    style={
                      this.props.mode === "dark"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    aria-current="page"
                    to="/sports"
                  >
                    Sports
                  </Link>
                </li>
                <li>
                  <Link
                    className="nav-link"
                    style={
                      this.props.mode === "dark"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    aria-current="page"
                    to="/business"
                  >
                    Business
                  </Link>
                </li>
                <li>
                  <Link
                    className="nav-link"
                    style={
                      this.props.mode === "dark"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    aria-current="page"
                    to="/entertainment"
                  >
                    Entertainment
                  </Link>
                </li>
                <li>
                  <Link
                    className="nav-link"
                    style={
                      this.props.mode === "dark"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    aria-current="page"
                    to="/health"
                  >
                    Health
                  </Link>
                </li>
                <li>
                  <Link
                    className="nav-link"
                    style={
                      this.props.mode === "dark"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    aria-current="page"
                    to="/science"
                  >
                    Science
                  </Link>
                </li>
                <li>
                  <Link
                    className="nav-link"
                    style={
                      this.props.mode === "dark"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    aria-current="page"
                    to="/technology"
                  >
                    Technology
                  </Link>
                </li>
              </ul>
              <div
                className="mode-toggle"
                onClick={this.props.toggleMode}
                title={`Switch to ${
                  this.props.mode === "light" ? "Dark" : "Light"
                } Mode`}
              >
                <img
                  src={this.props.mode === "light" ? lightmodeImg : darkmodeImg}
                  alt={`Switch to ${
                    this.props.mode === "light" ? "dark" : "light"
                  } mode`}
                  className={`bee ${
                    this.props.mode === "light" ? "buzzing" : "sleeping"
                  }`}
                />
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
