import React, { Component } from "react";
import { Route } from "react-router-dom";
// import { Container, Row, Col } from "reactstrap";
import axios from "axios";

import Search from "./components/Search";
import Result from "./components/Result";

const baseUrl = "https://digital-daijisen-viewer.herokuapp.com";
const localUrl = "http://localhost:3333";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      searchInput: "",
      results: ""
    };
  }

  componentDidMount = () => {
    const currentUrl = window.location.href;
    console.log("Current url is", currentUrl);
    // if (currentUrl.includes("dictionary/")) {
    //   window.location.href = "http://localhost:3000/";
    //   this.setState({ searchInput: "", results: "" });
    // } else
    if (currentUrl.includes("word/")) {
      this.fetchResults(currentUrl.replace(/https?:\/\/[^\/]*\/[a-z]*\//i, ""));
    }
  };

  // updateSearchInput = input => {
  //   this.fetchResults(input);
  // };

  fetchResults = searchTerm => {
    if (!searchTerm) {
      return;
    } else {
      this.setState({
        searchInput: searchTerm,
        results: "<h3 class='result' style='padding-top: 3%'>Loading...</h3>"
      });
      axios
        .get(
          `${baseUrl}/api/results/${searchTerm}`
        )
        .then(response => {
          this.setState(() => ({ results: response.data }));
        })
        .catch(error => {
          console.error("Server Error!!!: ", error);
          this.setState(() => ({
            results:
              "<h3 class='result' style='padding-top: 3%'>Error from .catch</h3>"
          }));
        });
    }
  };

  render() {
    return (
      <div className="app">
        <Route
          path="/"
          render={props => {
            return <Search {...props} fetchResults={this.fetchResults} />;
          }}
        />
        <Route
          exact
          path="/"
          render={() => {
            return <div className="result">Search something dude</div>;
          }}
        />
        <Route
          path={`/word/`}
          render={props => {
            return <Result {...props} results={this.state.results} />;
          }}
        />
      </div>
    );
  }
}
