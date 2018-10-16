import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import axios from "axios";

import Search from "./components/Search";
import BatchSearch from "./components/BatchSearch";
import Result from "./components/Result";

const herokuUrl = "https://digital-daijisen-viewer.herokuapp.com";
const localUrl = "http://localhost:3333";
const baseUrl = localUrl;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      batchSearch: false,
      results: "<h3>Look up a Japanese word using the searchbar.</h3>"
    };
  }

  componentDidMount = () => {
    const currentUrl = window.location.href;
    if (currentUrl.includes("word/")) {
      this.fetchResults(currentUrl.replace(/https?:\/\/[^\/]*\/[a-z]*\//i, ""));
    } else {
      const link = currentUrl + "word/辞書";
      this.setState({
        results: `<div><h3>Look up a Japanese word using the searchbar.</h3><div>Click this for example results: <a href=${link}>辞書</a></div></div>`
      });
    }
  };

  fetchResults = (searchTerm, alreadyResent) => {
    if (!searchTerm) {
      return;
    } else {
      this.setState({
        results: "<h3>Loading...</h3>"
      });
      axios
        .get(`${baseUrl}/api/results/${searchTerm}`)
        .then(response => {
          if (response.data.error && alreadyResent !== true) {
            const okuriganaRemoved = this.removeOkurigana(searchTerm);
            if (okuriganaRemoved !== null) {
              window.location.href = okuriganaRemoved;
              this.fetchResults(okuriganaRemoved, true);
            } else {
              this.setState({ results: response.data.error });
            }
          } else if (response.data.error) {
            console.log("response.data.error exists!");
            this.setState({ results: response.data.error });
          } else {
            this.setState(() => ({ results: response.data }));
          }
        })
        .catch(error => {
          console.error("Server Error!!!: ", error);
          this.setState(() => ({
            results: "<h3>Error from .catch</h3>"
          }));
        });
    }
  };

  toggleBatchSearch = () => {
    const current = this.state.batchSearch;
    this.setState({ batchSearch: !current });
  };

  fetchBatchResults = searchTerms => {
    console.log("INPUT", searchTerms.split(/\n/));
    searchTerms = searchTerms.split(/\n/);
    const results = [];
    const promises = [];
    for (let i = 0; i < searchTerms.length; i++) {
      const promise = axios
        .get(`${baseUrl}/api/results/${searchTerms[i]}`)
        .then(response => {
          if (response.data.error) {
            console.log("response.data.error exists!");
            results.push("Error");
          } else {
            results.push(response.data);
          }
        })
        .catch(error => {
          console.error("Server Error!!!: ", error);
          results.push("Error from .catch");
        });
      promises.push(promise);
    }

    Promise.all(promises).then(() => {
      console.log("RESULTS", results);
      this.setState({
        results: "<div class='batch-results'>" + results.join("") + "</div>"
      });
    });
  };

  whatCharType = char => {
    const hiraganaRange = /[\u3040-\u309f]/;
    const katakanaRange = /[\u30a0-\u30ff]/;
    const kanjiRange = /[\u4e00-\u9faf]/;
    if (char.match(hiraganaRange) !== null) {
      return "hiragana";
    } else if (char.match(katakanaRange) !== null) {
      return "katakana";
    } else if (char.match(kanjiRange) !== null) {
      return "kanji";
    } else return null;
  };

  removeOkurigana = str => {
    // as it stands this needs to be decoded
    str = decodeURIComponent(str);
    for (let i = 0; i < str.length; i++) {
      // If the first character isn't kanji, these rules don't apply so return
      if (i === 0 && this.whatCharType(str[i]) !== "kanji") {
        return null;
      } // else if the second/third character is a hiragana in between two kanji, it will return input minus this optional okurigana
      else if (
        i >= 1 &&
        this.whatCharType(str[i]) === "hiragana" &&
        str[i + 1] &&
        this.whatCharType(str[i + 1]) === "kanji"
      ) {
        return str.substr(0, i) + str.substr(i + 1);
      }
    }
    return null;
  };

  render() {
    if (this.state.batchSearch !== true) {
      return (
        <Container className="app">
          <Row>
            <Col>
              <Route
                path="/"
                render={props => {
                  return (
                    <Search
                      {...props}
                      fetchResults={this.fetchResults}
                      toggleBatchSearch={this.toggleBatchSearch}
                    />
                  );
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Route
                path="/"
                render={props => {
                  return <Result {...props} results={this.state.results} />;
                }}
              />
            </Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container className="app">
          <Row>
            <Col>
              <Route
                path="/"
                render={props => {
                  return (
                    <BatchSearch
                      {...props}
                      fetchBatchResults={this.fetchBatchResults}
                      toggleBatchSearch={this.toggleBatchSearch}
                    />
                  );
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Route
                path="/"
                render={props => {
                  return <Result {...props} results={this.state.results} />;
                }}
              />
            </Col>
          </Row>
        </Container>
      );
    }
  }
}
