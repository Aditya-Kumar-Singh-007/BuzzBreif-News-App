// import React, { Component } from "react";
// import NewsItem from "./NewsItem";
// import Spinner from "./Spinner";
// import PropTypes from "prop-types";

// export class SearchNews extends Component {
//   static defaultProps = {
//     pageSize: 20,
//     searchQuery: "",
//   };

//   static propTypes = {
//     pageSize: PropTypes.number,
//     searchQuery: PropTypes.string,
//   };

//   constructor(props) {
//     super(props);
//     this.state = {
//       articles: [],
//       loading: false,
//       page: 1,
//       totalResults: 0,
//       searchInput: this.props.searchQuery || "",
//     };
//   }

//   componentDidMount() {
//     if (this.props.searchQuery) {
//       this.searchNews(this.props.searchQuery);
//     }
//   }

//   componentDidUpdate(prevProps) {
//     if (prevProps.searchQuery !== this.props.searchQuery && this.props.searchQuery) {
//       this.setState({ searchInput: this.props.searchQuery });
//       this.searchNews(this.props.searchQuery);
//     }
//   }

//   searchNews = async (query) => {
//     if (!query.trim()) return;
    
//     this.props.setProgress(10);
//     this.setState({ loading: true, articles: [], page: 1 });

//     try {
//       const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${this.props.apiKey}&page=1&pageSize=${this.props.pageSize}&sortBy=publishedAt`;
//       const response = await fetch(url);
//       this.props.setProgress(50);
      
//       const data = await response.json();
      
//       if (data.status === "ok") {
//         this.setState({
//           articles: data.articles || [],
//           totalResults: data.totalResults || 0,
//           loading: false,
//         });
//       } else {
//         console.error("Search failed:", data.message);
//         this.setState({ loading: false });
//       }
//     } catch (error) {
//       console.error("Search error:", error);
//       this.setState({ loading: false });
//     }
    
//     this.props.setProgress(100);
//   };

// This is where we wish to get news from our github page data
// if you wish to get live news from News Api pull this app and
// comment below code and uncomment above one.

import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import defaultimage from "./defaultimage.jpg";

export class SearchNews extends Component {
  static defaultProps = {
    pageSize: 20,
    searchQuery: "",
  };

  static propTypes = {
    pageSize: PropTypes.number,
    searchQuery: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      searchInput: this.props.searchQuery || "",
      allArticles: [],
    };
  }

  componentDidMount() {
    this.loadAllArticles();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchQuery !== this.props.searchQuery && this.props.searchQuery) {
      this.setState({ searchInput: this.props.searchQuery });
      this.searchNews(this.props.searchQuery);
    }
  }

  loadAllArticles = async () => {
    const categories = ['general', 'business', 'sports', 'entertainment', 'health', 'science', 'technology'];
    let allArticles = [];
    
    try {
      for (const category of categories) {
        const url = `https://cdn.jsdelivr.net/gh/Aditya-Kumar-Singh-007/BuzzBreif_Data@latest/${category}.json?v=${new Date().getTime()}`;
        const response = await fetch(url);
        const data = await response.json();
        allArticles = [...allArticles, ...data.articles];
      }
      
      // Remove duplicates based on URL
      const uniqueArticles = [];
      const seenUrls = new Set();
      
      allArticles.forEach(article => {
        if (article && article.url && !seenUrls.has(article.url)) {
          seenUrls.add(article.url);
          uniqueArticles.push(article);
        }
      });
      
      this.setState({ allArticles: uniqueArticles });
    } catch (error) {
      console.error("Failed to load articles:", error);
    }
  };

  searchNews = async (query) => {
    if (!query.trim()) return;
    
    this.props.setProgress(10);
    this.setState({ loading: true, articles: [] });

    try {
      this.props.setProgress(50);
      
      const filteredArticles = this.state.allArticles.filter(article => 
        article.title?.toLowerCase().includes(query.toLowerCase()) ||
        article.description?.toLowerCase().includes(query.toLowerCase())
      );
      
      this.setState({
        articles: filteredArticles.slice(0, this.props.pageSize),
        loading: false,
      });
    } catch (error) {
      console.error("Search error:", error);
      this.setState({ loading: false });
    }
    
    this.props.setProgress(100);
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    this.searchNews(this.state.searchInput);
  };

  handleInputChange = (e) => {
    this.setState({ searchInput: e.target.value });
  };

  render() {
    return (
      <div className="container" style={{ marginTop: "90px" }}>
        <div className="search-container">
          <h1 
            className="text-center myFontForHeadText mb-4"
            style={{ color: this.props.mode === "dark" ? "white" : "black" }}
          >
            Search News
          </h1>
          
          <form onSubmit={this.handleSearchSubmit} className="search-form mb-4">
            <div className="input-group">
              <input
                type="text"
                className={`form-control search-input ${this.props.mode === "dark" ? "dark-input" : ""}`}
                placeholder="Search for news..."
                value={this.state.searchInput}
                onChange={this.handleInputChange}
              />
              <button 
                className="btn btn-primary search-btn" 
                type="submit"
                disabled={!this.state.searchInput.trim()}
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {this.state.loading && <Spinner />}

        {this.state.articles.length > 0 && (
          <div className="results-info mb-3">
            <p style={{ color: this.props.mode === "dark" ? "white" : "black" }}>
              Found {this.state.totalResults} results for "{this.state.searchInput}"
            </p>
          </div>
        )}

        <div className="row">
          {this.state.articles.map((article, index) => {
            if (!article || !article.title) return null;
            
            return (
              <div className="col-md-4" key={article.url || index}>
                <NewsItem
                  mode={this.props.mode}
                  title={article.title?.length > 50 ? article.title.slice(0, 50) + "..." : article.title}
                  description={article.description || ""}
                  imageUrl={article.image || defaultimage}
                  newsUrl={article.url}
                  author={article.author || "Unknown"}
                  date={article.published_at ? new Date(article.published_at).toDateString() : "Unknown"}
                  source={article.source || "Unknown"}
                />
              </div>
            );
          })}
        </div>

        {this.state.articles.length === 0 && !this.state.loading && this.state.searchInput && (
          <div className="no-results text-center">
            <p style={{ color: this.props.mode === "dark" ? "white" : "black" }}>
              No results found for "{this.state.searchInput}". Try different keywords.
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default SearchNews;