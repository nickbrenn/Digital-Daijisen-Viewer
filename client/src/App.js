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
      <div>
        <Route
          path="/"
          render={props => {
            return (
              <Search {...props} updateSearchInput={this.updateSearchInput} />
            );
          }}
        />
        <br />
        <br />
        <Route
          path={`/results/`}
          render={props => {
            return <Result {...props} results={this.state.results} />;
          }}
        />
      </div>
    );
  }
}
