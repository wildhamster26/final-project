import React, { Component } from 'react'

export default class SearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ""
    }
  }
  changeSearchBar(e){
    // console.log(e.target.value.toLowerCase())
    this.props.onSearch(e.target.value.toLowerCase());
  }
  render() {
    return (
      <div className="search-box">
        <form>
          <input type="text" name="search" placeholder={this.props.placeholder} onChange={(e) => this.changeSearchBar(e)}></input>
        </form>
      </div>
    )
  }
}