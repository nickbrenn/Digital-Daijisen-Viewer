import React, { Component } from "react";
import { Input, Button } from "reactstrap";

export default class BatchSearch extends Component {
  state = {
    searchInput: ""
  };

  handleSearchInput = e => {
    this.setState({ searchInput: e.target.value });
  };

  handleSubmit = () => {
    this.props.fetchBatchResults(this.state.searchInput);
    const searchTerms = this.state.searchInput.split(/\n/).join("?");
    this.props.history.push(`/batchwords/${searchTerms}`);
  };

  render() {
    return (
      <div className="search">
        <Input
          type="textarea"
          placeholder="Input a list of words with one word per line and click the search button"
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
          onClick={event => {
            event.target.blur();
            this.props.toggleBatchSearch();
          }}
        >
          Search by word
        </Button>
      </div>
    );
  }
}
