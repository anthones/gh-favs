import React, { Component } from "react";

export default class Loader extends Component {
  render() {
    return (
      <div className="flex items-center justify-center space-x-2 align-middle">
        <div
          className="spinner-grow inline-block w-12 h-12 bg-current rounded-full opacity-0"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
}
