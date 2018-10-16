import React, { Component } from "react";
import { Input, Button } from "reactstrap";

export default class Search extends Component {
  state = {
    searchInput: ""
  };

  handleSearchInput = e => {
    this.setState({ searchInput: e.target.value });
  };

  handleSubmit = () => {
    this.props.fetchResults(this.state.searchInput);
    this.props.history.push(`/word/${this.state.searchInput}`);
  };

  render() {
    return (
      <div className="search">
        <Input
          onKeyDown={event => {
            if (event.key === "Enter") {
              event.target.blur();
              this.handleSubmit();
            }
          }}
          type="text"
          placeholder="Look up a word"
          onChange={this.handleSearchInput}
          value={this.state.searchInput}
        />
        <Button
          color="primary"
          onClick={event => {
            event.target.blur();
            this.handleSubmit();
          }}
        >
          Search
        </Button>
        <Button
          color="primary"
          className="secondary-btn"
          onClick={event => {
            event.target.blur();
            this.props.toggleBatchSearch();
          }}
        >
          Batch Search
        </Button>
      </div>
    );
  }
}
