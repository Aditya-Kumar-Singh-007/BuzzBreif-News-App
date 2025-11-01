// import React, { Component } from "react";
// import NewsItem from "./NewsItem";
// import Spinner from "./Spinner";
// import PropTypes from "prop-types";
// import InfiniteScroll from "react-infinite-scroll-component";

// export class News extends Component {
//   static defaultProps = {
//     country: "in",
//     pageSize: 20,
//     category: "general",
//     headText: "BuzzBreif",
//   };

//   static propTypes = {
//     country: PropTypes.string,
//     pageSize: PropTypes.number,
//     category: PropTypes.string,
//     headText: PropTypes.string,
//   };

//   constructor(props) {
//     super(props);
//     this.state = {
//       articles: [],
//       loading: false,
//       page: 1,
//       totalResults: 0,
//     };
//     document.title = `BuzzBreif - ${
//       this.props.category === "general"
//         ? "News that stings!"
//         : this.props.category.slice(0, 1).toUpperCase() +
//           this.props.category.slice(1)
//     }`;
//   }

//   async updateNews(page) {
//     this.props.setProgress(10);
//     let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${page}&pageSize=${this.props.pageSize}`;
//     this.setState({ loading: true });
//     let data = await fetch(url);

//     this.props.setProgress(50);

//     let parsedData = await data.json();

//     this.setState({
//       articles: parsedData.articles,
//       loading: false,
//       totalResults: parsedData.totalResults,
//       checkLenght: parsedData.articles.length,
//     });
//     this.props.setProgress(100);
//   }

//   async componentDidMount() {
//     this.updateNews(this.state.page);
//   }

//   fetchMoreData = async () => {
//     const nextPage = this.state.page + 1;

//     let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${nextPage}&pageSize=${this.props.pageSize}`;
//     let data = await fetch(url);
//     let parsedData = await data.json();
//     this.setState({ checkLenght: parsedData.articles.length });
//     if (!parsedData.articles || parsedData.articles.length === 0) {
//       return;
//     }

//     this.setState({
//       articles: this.state.articles.concat(parsedData.articles),
//       page: nextPage,
//     });
//   };

//   render() {
//     return (
//       <>
//         <h1
//           className="text-center myFontForHeadText"
//           style={{
//             marginTop: "90px",
//             color: this.props.mode === "dark" ? "white" : "black",
//           }}
//         >
//           {this.props.headText} - Top Headlines !
//         </h1>
//         {this.state.loading && <Spinner />}

//         <InfiniteScroll
//           dataLength={this.state.articles.length}
//           next={this.fetchMoreData}
//           hasMore={
//             this.state.articles.length < this.state.totalResults &&
//             this.state.checkLenght > 0
//           }
//           loader={<Spinner />}
//         >
//           <div className="container">
//             <div className="row my-5">
//               {this.state.articles.map((element) => {
//                 if (element.description) {
//                   return (
//                     <div className="col-md-4" key={element.url}>
//                       <NewsItem
//                         mode={this.props.mode}
//                         toggleMode={this.props.toggleMode}
//                         title={
//                           !element.title
//                             ? ""
//                             : element.title.slice(0, 50) + "..."
//                         }
//                         description={
//                           !element.description ? "" : element.description
//                         }
//                         imageUrl={
//                           !element.urlToImage
//                             ? "defaultimage.jpg"
//                             : element.urlToImage
//                         }
//                         newsUrl={element.url}
//                         author={!element.author ? "Unknown" : element.author}
//                         date={
//                           !element.publishedAt
//                             ? "Few Days Ago"
//                             : new Date(element.publishedAt).toDateString()
//                         }
//                         source={element.source.name}
//                       />
//                     </div>
//                   );
//                 }
//                 return null;
//               })}
//             </div>
//           </div>
//         </InfiniteScroll>
//       </>
//     );
//   }
// }

// export default News;

// // This is where we wish to get news from our github page data
// // if you wish to get live news from News Api pull this app and
// // comment below code and uncomment above one.

import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import defaultimage from "./defaultimage.jpg";

// Simple cache implementation
const newsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class News extends Component {
  static defaultProps = {
    pageSize: 20,
    category: "business",
    headText: "BuzzBreif",
  };

  static propTypes = {
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
      checkLength: 0,
      error: null,
      retryCount: 0,
      allArticles: [],
    };

    // Set dynamic document title
    document.title = `BuzzBreif - ${
      this.props.category === "general"
        ? "News that stings!"
        : this.props.category.charAt(0).toUpperCase() +
          this.props.category.slice(1)
    }`;
  }

  // Check cache for existing data
  getCachedData = (cacheKey) => {
    const cached = newsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  };

  // Store data in cache
  setCachedData = (cacheKey, data) => {
    newsCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  };

  // Enhanced news fetching with caching and error handling
  async updateNews(page) {
    const cacheKey = `${this.props.category}`;
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      const { pageSize } = this.props;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const articles = cachedData.allArticles.slice(startIndex, endIndex);
      
      this.setState({
        articles,
        allArticles: cachedData.allArticles,
        loading: false,
        checkLength: articles.length,
        page,
        error: null,
      });
      return;
    }

    this.setState({ loading: true, error: null });
    this.props.setProgress(10);
    
    try {
      const url = `https://cdn.jsdelivr.net/gh/Aditya-Kumar-Singh-007/BuzzBreif_Data@latest/${this.props.category}.json?v=${new Date().getTime()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.props.setProgress(50);
      const parsedData = await response.json();
      
      // Remove duplicates based on URL
      const uniqueArticles = [];
      const seenUrls = new Set();
      
      (parsedData.articles || []).forEach(article => {
        if (article && article.url && !seenUrls.has(article.url)) {
          seenUrls.add(article.url);
          uniqueArticles.push(article);
        }
      });
      
      const allArticles = uniqueArticles;

      const { pageSize } = this.props;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const articles = allArticles.slice(startIndex, endIndex);

      // Cache the data
      this.setCachedData(cacheKey, { allArticles });

      this.setState({
        articles,
        allArticles,
        loading: false,
        checkLength: articles.length,
        page,
        error: null,
        retryCount: 0,
      });
    } catch (error) {
      console.error("Failed to fetch news:", error);
      this.setState({ 
        loading: false, 
        error: error.message,
        retryCount: this.state.retryCount + 1,
      });
    }
    
    this.props.setProgress(100);
  }

  // Initial fetch on mount
  componentDidMount() {
    this.updateNews(this.state.page);
  }

  // Enhanced infinite scroll with caching
  fetchMoreData = async () => {
    const nextPage = this.state.page + 1;
    const { pageSize } = this.props;
    const startIndex = (nextPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const nextArticles = this.state.allArticles.slice(startIndex, endIndex);
    
    if (!nextArticles || nextArticles.length === 0) return;

    this.setState({
      articles: this.state.articles.concat(nextArticles),
      page: nextPage,
      checkLength: nextArticles.length,
    });
  };

  // Retry function for failed requests
  retryFetch = () => {
    this.updateNews(this.state.page);
  };

  render() {
    const { error, loading, articles, retryCount } = this.state;
    
    return (
      <div className="fade-in">
        {/* Page Heading */}
        <h1
          className="text-center myFontForHeadText"
          style={{
            marginTop: "90px",
            color: this.props.mode === "dark" ? "white" : "black",
          }}
        >
          {this.props.headText} - Top Headlines !
        </h1>

        {/* Error Handling */}
        {error && (
          <div className="container">
            <div className="alert alert-danger text-center" role="alert">
              <h4>Oops! Something went wrong</h4>
              <p>{error}</p>
              {retryCount < 3 && (
                <button 
                  className="btn btn-primary" 
                  onClick={this.retryFetch}
                >
                  Try Again
                </button>
              )}
              {retryCount >= 3 && (
                <p className="text-muted">Please check your internet connection and refresh the page.</p>
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && <Spinner />}

        {/* Articles Display */}
        {!error && !loading && articles.length === 0 && (
          <div className="container text-center">
            <p style={{ color: this.props.mode === "dark" ? "white" : "black" }}>
              No articles available at the moment. Please try again later.
            </p>
          </div>
        )}

        {/* Infinite Scroll Container */}
        {!error && articles.length > 0 && (
          <InfiniteScroll
            dataLength={articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length < this.state.allArticles.length}
            loader={<Spinner />}
            endMessage={
              <div className="text-center p-4">
                <p style={{ color: this.props.mode === "dark" ? "white" : "black" }}>
                  <b>You've reached the end! 🎉</b>
                </p>
              </div>
            }
          >
            <div className="container">
              <div className="row my-5">
                {articles.map((element, index) => {
                  if (!element) return null;

                  return (
                    <div className="col-md-4 mb-4" key={element.url || index}>
                      <NewsItem
                        mode={this.props.mode}
                        toggleMode={this.props.toggleMode}
                        title={
                          !element.title ? "" : element.title.length > 50 
                            ? element.title.slice(0, 50) + "..."
                            : element.title
                        }
                        description={element.description || "No description available."}
                        imageUrl={
                          !element.image ? defaultimage : element.image
                        }
                        newsUrl={element.url}
                        author={element.author || "Unknown"}
                        date={
                          element.published_at
                            ? new Date(element.published_at).toDateString()
                            : "Few Days Ago"
                        }
                        source={element.source || "Unknown"}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </InfiniteScroll>
        )}
      </div>
    );
  }
}

export default News;
