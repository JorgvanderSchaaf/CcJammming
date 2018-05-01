import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.state = {
      term: ''
    };
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  handleTermChange(event) {
    this.setState({ term: event.target.value })
  }

  render() {
    return (<div className="SearchBar">
      <input
        placeholder="Enter A Song, Album, or Artist"
        onChange={this.handleTermChange}
// The 'Search on pressing enter' feature using the onKeyPress event:
        onKeyPress={event => {
                    if (event.key === 'Enter') {
                      this.search() }
                  }}

      />
      <a onClick={this.search}>SEARCH</a>
    </div>
    );
  }

}

export default SearchBar;
