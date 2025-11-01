import React, { Component } from "react";

export class NewsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBookmarked: false,
      imageError: false,
    };
  }

  componentDidMount() {
    // Check if article is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const isBookmarked = bookmarks.some(bookmark => bookmark.url === this.props.newsUrl);
    this.setState({ isBookmarked });
  }

  toggleBookmark = (e) => {
    e.preventDefault();
    const { title, description, imageUrl, newsUrl, author, date, source } = this.props;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    if (this.state.isBookmarked) {
      // Remove bookmark
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.url !== newsUrl);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      this.setState({ isBookmarked: false });
    } else {
      // Add bookmark
      const newBookmark = { title, description, imageUrl, url: newsUrl, author, date, source };
      bookmarks.push(newBookmark);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      this.setState({ isBookmarked: true });
    }
  };

  handleImageError = () => {
    this.setState({ imageError: true });
  };



  render() {
    let { title, description, imageUrl, newsUrl, author, date, source } = this.props;
    const { isBookmarked, imageError } = this.state;
    
    return (
      <div className="my-3 d-flex justify-content-center">
        <div className={this.props.mode === "dark" ? "dark-card" : "card"}>
          {/* Source Badge */}
          <div className="mySourceBadge">
            <span className="badge rounded-pill bg-danger">
              {source.length > 25 ? source.slice(0, 25) + "..." : source}
            </span>
          </div>

          {/* Bookmark Button */}
          <div className="bookmark-btn" onClick={this.toggleBookmark}>
            <span className={`bookmark-icon ${isBookmarked ? 'bookmarked' : ''}`}>
              {isBookmarked ? '★' : '☆'}
            </span>
          </div>

          {/* Image */}
          <div className={this.props.mode === "dark" ? "dark-image" : "image"}>
            <img
              src={imageError ? "defaultimage.jpg" : imageUrl}
              className="card-img-top"
              style={{ height: "8rem", objectFit: "cover" }}
              alt="NEWS"
              onError={this.handleImageError}
            />
          </div>

          {/* Title */}
          <div className={this.props.mode === "dark" ? "dark-title" : "title"}>
            <h5 className="card-title">{title}</h5>
          </div>

          {/* Description */}
          <div className={this.props.mode === "dark" ? "dark-description" : "description"}>
            <p className="card-text">{description}</p>
          </div>



          {/* Author and Date */}
          <div className="card-meta mb-3">
            <small className={this.props.mode === "dark" ? "text-light" : "text-muted"}>
              By <strong>{author}</strong> • {date}
            </small>
          </div>

          {/* Action Buttons */}
          <div className={this.props.mode === "dark" ? "dark-readMore" : "readMore"}>
            <div className="d-flex justify-content-between align-items-center">
              <a
                href={newsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Read More →
              </a>
              <div className="article-actions">
                <button 
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => navigator.share && navigator.share({
                    title: title,
                    text: description,
                    url: newsUrl
                  })}
                  title="Share Article"
                >
                  📤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewsItem;
