import "./App.css";

import React, { Component } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import News from "./components/News";
import SearchNews from "./components/SearchNews";
import Bookmarks from "./components/Bookmarks";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

export default class App extends Component {
  // apiKey = process.env.REACT_APP_NEWS_API_KEY; // For NewsAPI usage
  // This is where we wish to get news from our github page data
  // if you wish to get live news from News Api pull this app and
  // uncomment above line and comment below one.
  apiKey = null; // Using static JSON data

  state = {
    progress: 0,
    mode: localStorage.getItem('theme') || 'light',
    searchQuery: '',
  };

  // News categories configuration
  newsCategories = [
    { path: "/", category: "general", headText: "BuzzBreif", key: "general" },
    { path: "/sports", category: "sports", headText: "Sports", key: "sports" },
    { path: "/business", category: "business", headText: "Business", key: "business" },
    { path: "/entertainment", category: "entertainment", headText: "Entertainment", key: "entertainment" },
    { path: "/health", category: "health", headText: "Health", key: "health" },
    { path: "/science", category: "science", headText: "Science", key: "science" },
    { path: "/technology", category: "technology", headText: "Technology", key: "technology" },
  ];

  componentDidMount() {
    // Apply saved theme on mount
    this.applyTheme(this.state.mode);
  }

  setProgress = (progress) => {
    this.setState({ progress: progress });
  };

  applyTheme = (mode) => {
    if (mode === "dark") {
      document.body.style.backgroundColor = "#121212";
      document.body.style.color = "white";
    } else {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
    }
  };

  toggleMode = () => {
    const newMode = this.state.mode === "light" ? "dark" : "light";
    this.setState({ mode: newMode });
    localStorage.setItem('theme', newMode);
    this.applyTheme(newMode);
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query });
  };



  // Render news route component
  renderNewsRoute = (categoryConfig) => {
    return (
      <News
        mode={this.state.mode}
        toggleMode={this.toggleMode}
        setProgress={this.setProgress}
        apiKey={this.apiKey}
        key={categoryConfig.key}
        headText={categoryConfig.headText}
        country="us"
        category={categoryConfig.category}
      />
    );
  };

  render() {
    return (
      <div className={`app ${this.state.mode}`}>
        <LoadingBar color="#F7CE4C" progress={this.state.progress} height={3} />
        <Router>
          <Navbar 
            mode={this.state.mode} 
            toggleMode={this.toggleMode}
            onSearch={this.handleSearch}
          />

          <Routes>
            {/* Dynamic routes for news categories */}
            {this.newsCategories.map((categoryConfig) => (
              <Route
                key={categoryConfig.key}
                path={categoryConfig.path}
                element={this.renderNewsRoute(categoryConfig)}
              />
            ))}

            
            {/* Search route */}
            <Route
              path="/search"
              element={
                <SearchNews
                  mode={this.state.mode}
                  setProgress={this.setProgress}
                  searchQuery={this.state.searchQuery}
                />
              }
            />
            
            {/* Bookmarks route */}
            <Route
              path="/bookmarks"
              element={
                <Bookmarks
                  mode={this.state.mode}
                />
              }
            />
          </Routes>
        </Router>
        <Footer mode={this.state.mode} />
      </div>
    );
  }
}
