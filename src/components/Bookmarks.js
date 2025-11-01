import React, { Component } from "react";
import NewsItem from "./NewsItem";

export class Bookmarks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarks: [],
    };
  }

  componentDidMount() {
    this.loadBookmarks();
    // Listen for bookmark changes
    window.addEventListener('storage', this.loadBookmarks);
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.loadBookmarks);
  }

  loadBookmarks = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    this.setState({ bookmarks });
  };

  clearAllBookmarks = () => {
    if (window.confirm('Are you sure you want to clear all bookmarks?')) {
      localStorage.removeItem('bookmarks');
      this.setState({ bookmarks: [] });
    }
  };

  render() {
    const { bookmarks } = this.state;

    return (
      <div className="container fade-in" style={{ marginTop: "90px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 
            className="myFontForHeadText"
            style={{ color: this.props.mode === "dark" ? "white" : "black" }}
          >
            Your Bookmarks ❤️
          </h1>
          {bookmarks.length > 0 && (
            <button 
              className="btn btn-outline-danger"
              onClick={this.clearAllBookmarks}
            >
              Clear All
            </button>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
            <h3 style={{ color: this.props.mode === "dark" ? "white" : "black" }}>
              No bookmarks yet
            </h3>
            <p style={{ color: this.props.mode === "dark" ? "#ccc" : "#666" }}>
              Start bookmarking articles by clicking the heart icon on any news card
            </p>
          </div>
        ) : (
          <>
            <p 
              className="text-center mb-4"
              style={{ color: this.props.mode === "dark" ? "#ccc" : "#666" }}
            >
              You have {bookmarks.length} saved article{bookmarks.length !== 1 ? 's' : ''}
            </p>
            <div className="row">
              {bookmarks.map((bookmark, index) => (
                <div className="col-md-4 mb-4" key={bookmark.url || index}>
                  <NewsItem
                    mode={this.props.mode}
                    title={bookmark.title}
                    description={bookmark.description}
                    imageUrl={bookmark.imageUrl}
                    newsUrl={bookmark.url}
                    author={bookmark.author}
                    date={bookmark.date}
                    source={bookmark.source}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Bookmarks;