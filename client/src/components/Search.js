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
    this.props.updateSearchInput(this.state.searchInput);
    this.props.history.push(`/results/${this.state.searchInput}`);
  };

  render() {
    return (
      <div className="search">
        <Input
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
