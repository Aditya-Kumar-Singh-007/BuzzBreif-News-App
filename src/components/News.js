import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 20,
    category: "general",
    headText: "BuzzBreif",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    headText: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
    };
    document.title = `BuzzBreif - ${
      this.props.category === "general"
        ? "News that stings!"
        : this.props.category.slice(0, 1).toUpperCase() +
          this.props.category.slice(1)
    }`;
  }

  async updateNews(page) {
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);

    this.props.setProgress(50);

    let parsedData = await data.json();

    this.setState({
      articles: parsedData.articles,
      loading: false,
      totalResults: parsedData.totalResults,
      checkLenght: parsedData.articles.length,
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updateNews(this.state.page);
  }

  fetchMoreData = async () => {
    const nextPage = this.state.page + 1;

    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${nextPage}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({ checkLenght: parsedData.articles.length });
    if (!parsedData.articles || parsedData.articles.length === 0) {
      return;
    }

    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      page: nextPage,
    });
  };

  render() {
    return (
      <>
        <h1
          className="text-center myFontForHeadText"
          style={{
            marginTop: "90px",
            color: this.props.mode === "dark" ? "white" : "black",
          }}
        >
          {this.props.headText} - Top Headlines !
        </h1>
        {this.state.loading && <Spinner />}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={
            this.state.articles.length < this.state.totalResults &&
            this.state.checkLenght > 0
          }
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row my-5">
              {this.state.articles.map((element) => {
                if (element.description) {
                  return (
                    <div className="col-md-4" key={element.url}>
                      <NewsItem
                        mode={this.props.mode}
                        toggleMode={this.props.toggleMode}
                        title={
                          !element.title
                            ? ""
                            : element.title.slice(0, 50) + "..."
                        }
                        description={
                          !element.description ? "" : element.description
                        }
                        imageUrl={
                          !element.urlToImage
                            ? "defaultimage.jpg"
                            : element.urlToImage
                        }
                        newsUrl={element.url}
                        author={!element.author ? "Unknown" : element.author}
                        date={
                          !element.publishedAt
                            ? "Few Days Ago"
                            : new Date(element.publishedAt).toDateString()
                        }
                        source={element.source.name}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }
}

export default News;
