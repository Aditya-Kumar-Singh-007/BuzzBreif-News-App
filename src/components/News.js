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

export class News extends Component {
  static defaultProps = {
    pageSize: 20,
    category: "business", // default category
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
      articles: [], // articles array
      loading: false, // show spinner while fetching
      page: 1, // current page
      checkLength: 0, // number of articles fetched in last request
    };

    // Set dynamic document title
    document.title = `BuzzBreif - ${
      this.props.category === "general"
        ? "News that stings!"
        : this.props.category.charAt(0).toUpperCase() +
          this.props.category.slice(1)
    }`;
  }

  // Fetch news for a page
  async updateNews(page) {
    this.setState({ loading: true });
    try {
      let url = `https://cdn.jsdelivr.net/gh/Aditya-Kumar-Singh-007/BuzzBreif_Data@latest/${this.props.category}.json`;
      let data = await fetch(url);
      let parsedData = await data.json();

      const { pageSize } = this.props;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const articles = parsedData.articles.slice(startIndex, endIndex);

      this.setState({
        articles,
        loading: false,
        checkLength: articles.length,
        page,
      });
    } catch (error) {
      console.error("Failed to fetch news:", error);
      this.setState({ loading: false });
    }
  }

  // Initial fetch on mount
  componentDidMount() {
    this.updateNews(this.state.page);
  }

  // Infinite scroll: fetch next page
  fetchMoreData = async () => {
    const nextPage = this.state.page + 1;
    try {
      let url = `https://cdn.jsdelivr.net/gh/Aditya-Kumar-Singh-007/BuzzBreif_Data@latest/${this.props.category}.json`;
      let data = await fetch(url);
      let parsedData = await data.json();

      const { pageSize } = this.props;
      const startIndex = (nextPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const nextArticles = parsedData.articles.slice(startIndex, endIndex);

      if (!nextArticles || nextArticles.length === 0) return;

      this.setState({
        articles: this.state.articles.concat(nextArticles),
        page: nextPage,
        checkLength: nextArticles.length,
      });
    } catch (error) {
      console.error("Failed to fetch more news:", error);
    }
  };

  render() {
    return (
      <>
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

        {/* Spinner while loading */}
        {this.state.loading && <Spinner />}

        {/* Infinite Scroll container */}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.checkLength > 0} // stop fetching when no more articles
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row my-5">
              {this.state.articles.map((element, index) => {
                if (!element) return null;

                return (
                  <div className="col-md-4" key={element.url || index}>
                    <NewsItem
                      mode={this.props.mode}
                      toggleMode={this.props.toggleMode}
                      title={
                        !element.title ? "" : element.title.slice(0, 50) + "..."
                      }
                      description={element.description || ""}
                      imageUrl={
                        !element.image ?defaultimage: element.image
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
      </>
    );
  }
}

export default News;
