import "./App.css";

import React, { Component } from "react";
import Navbar from "./components/Navbar";
import News from "./components/News";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

export default class App extends Component {
  apiKey = "3b68e6af9c0847cea8b360eb65c429e1";

  state = {
    progress: 0,
    mode: "light",
  };

  setProgress = (progress) => {
    this.setState({ progress: progress });
  };

  toggleMode = () => {
    if (this.state.mode === "light") {
      this.setState({ mode: "dark" });
      document.body.style.backgroundColor = "#121212";
    } else if (this.state.mode === "dark") {
      this.setState({ mode: "light" });
      document.body.style.backgroundColor = "white";
    }
  };

  render() {
    return (
      <div>
        <LoadingBar color=" #F7CE4C" progress={this.state.progress} />
        <Router>
          <Navbar mode={this.state.mode} toggleMode={this.toggleMode} />

          <Routes>
            <Route
              path="/"
              element={
                <News
                  mode={this.state.mode}
                  toggleMode={this.toggleMode}
                  setProgress={this.setProgress}
                  apiKey={this.apiKey}
                  key="general"
                  headText="BuzzBreif"
                  country="us"
                  category="general"
                />
              }
            />
            <Route
              path="/sports"
              element={
                <News
                  mode={this.state.mode}
                  toggleMode={this.toggleMode}
                  setProgress={this.setProgress}
                  apiKey={this.apiKey}
                  key="sports"
                  headText="Sports"
                  country="us"
                  category="sports"
                />
              }
            />
            <Route
              path="/business"
              element={
                <News
                  mode={this.state.mode}
                  toggleMode={this.toggleMode}
                  setProgress={this.setProgress}
                  apiKey={this.apiKey}
                  key="business"
                  headText="Business"
                  country="us"
                  category="business"
                />
              }
            />
            <Route
              path="/entertainment"
              element={
                <News
                  mode={this.state.mode}
                  toggleMode={this.toggleMode}
                  setProgress={this.setProgress}
                  apiKey={this.apiKey}
                  key="entertainment"
                  headText="Entertainment"
                  country="us"
                  category="entertainment"
                />
              }
            />
            <Route
              path="/health"
              element={
                <News
                  mode={this.state.mode}
                  toggleMode={this.toggleMode}
                  setProgress={this.setProgress}
                  apiKey={this.apiKey}
                  key="health"
                  country="us"
                  headText="Health"
                  category="health"
                />
              }
            />
            <Route
              path="/science"
              element={
                <News
                  mode={this.state.mode}
                  toggleMode={this.toggleMode}
                  setProgress={this.setProgress}
                  apiKey={this.apiKey}
                  key="science"
                  country="us"
                  headText="Science"
                  category="science"
                />
              }
            />
            <Route
              path="/technology"
              element={
                <News
                  mode={this.state.mode}
                  toggleMode={this.toggleMode}
                  setProgress={this.setProgress}
                  apiKey={this.apiKey}
                  key="technology"
                  country="us"
                  headText="Technology"
                  category="technology"
                />
              }
            />
          </Routes>
        </Router>
      </div>
    );
  }
}
