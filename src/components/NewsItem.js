import React, { Component } from "react";

export class NewsItem extends Component {
  render() {
    let { title, description, imageUrl, newsUrl, author, date, source } =
      this.props;
    return (
      <div className="my-3 d-flex justify-content-center">
        <div className={this.props.mode === "dark" ? "dark-card" : "card"}>
          <div className="mySourceBadge">
            <span className=" badge rounded-pill bg-danger">
              {source.length > 35 ? source.slice(0, 35) + "..." : source}
            </span>
          </div>
          <div className={this.props.mode === "dark" ? "dark-image" : "image"}>
            <img
              src={imageUrl}
              className="card-img-top"
              style={{ height: "8rem", objectFit: "cover" }}
              alt="NEWS"
            />
          </div>

          <div className={this.props.mode === "dark" ? "dark-title" : "title"}>
            <h5 className="card-title">{title}</h5>
          </div>

          <div
            className={
              this.props.mode === "dark" ? "dark-description" : "description"
            }
          >
            <p className="card-text">{description}</p>
          </div>
          <p className="card-text">
            <small
              className={
                this.props.mode === "dark"
                  ? "text-light"
                  : "text-body-secondary"
              }
            >
              By {author} on {date}
            </small>
          </p>
          <div
            className={
              this.props.mode === "dark" ? "dark-readMore" : "readMore"
            }
          >
            <a
              href={newsUrl}
              target=""
              className="btn btn-primary"
              style={{
                backgroundColor: this.props.mode === "dark" ? "grey" : "",
                paddingTop: "0.25rem",
                paddingBottom: "0.25rem",
                "--bs-btn-padding-x": "0.5rem",
                "--bs-btn-font-size": "0.75rem",
                border: "none",
              }}
            >
              Read More &#x2192;
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default NewsItem;
