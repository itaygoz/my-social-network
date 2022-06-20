import React, { Component } from "react";
import Popup from "reactjs-popup";

class Image extends Component {
  state = { active: false };

  toggleClass() {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
  }

  render() {
    const { src, alt } = this.props;
    return (
      <Popup
        trigger={
          <img
            src={src}
            className="mr-3 img-thumbnail rounded thumb"
            alt={alt}
          />
        }
        closeOnDocumentClick
        modal
        nested
      >
        {(close) => (
          <img
            src={src}
            className="fullsize rounded"
            alt={alt}
            onClick={() => close()}
          />
        )}
      </Popup>
    );
  }
}

export default Image;
