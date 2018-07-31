import React, { Component } from "react";
import { Route } from "react-router-dom";
// import { Container, Row, Col } from "reactstrap";
import axios from "axios";

import Search from "./components/Search";
import Result from "./components/Result";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      searchInput: null,
      results: null
    };
  }

  componentDidMount = () => {
    const currentUrl = window.location.href;
    console.log(currentUrl);
    if (currentUrl.includes("dictionary/")) {
      window.location.href = "http://localhost:3000/";
      this.setState({ searchInput: null, results: null });
    } else if (currentUrl.includes("word/")) {
      this.fetchResults(
        currentUrl.replace(/http:\/\/localhost:3000\/[a-z]*\//i, "")
      );
    }
  };

  updateSearchInput = input => {
    this.setState({ searchInput: input, results: "Loading..." });
    this.fetchResults(input);
  };

  fetchResults = searchTerm => {
    axios
      .get(`http://localhost:5000/api/results/${searchTerm}`)
      .then(response => {
        this.setState(() => ({ results: response.data }));
      })
      .catch(error => {
        console.error("Server Error!!!: ", error);
        this.setState(() => ({ results: "Error" }));
      });
  };

  render() {
    return (
      <div className="app">
        <Route
          path="/"
          render={props => {
            return (
              <Search {...props} updateSearchInput={this.updateSearchInput} />
            );
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
