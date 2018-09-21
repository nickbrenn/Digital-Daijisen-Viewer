import React, { Component } from "react";
import { Input, Button } from "reactstrap";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: ""
    };
  }

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
              event.preventDefault();
              event.stopPropagation();
              this.handleSubmit();
            }
          }}
          type="text"
          placeholder="Look up a word"
          onChange={this.handleSearchInput}
          value={this.state.searchInput}
        />
        <Button
          onClick={() => {
            this.handleSubmit();
          }}
        >
          Search
        </Button>
      </div>
    );
  }
}
