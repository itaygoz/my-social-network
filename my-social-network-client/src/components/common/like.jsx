import React, { Component, Fragment } from "react";
import { getLikes } from "../../services/likeService";
import _ from "lodash";
import { getCurrentUser } from "../../services/authService";
import Popup from "reactjs-popup";

class Like extends Component {
  state = { likesCount: 0, likes: [], liked: false };
  async componentDidMount() {
    const { postId, likesCount } = this.props;
    const { data: likes } = await getLikes(postId);
    const liked = _.includes(likes._id, getCurrentUser()._id);
    this.setState({ likesCount, likes, liked });
  }
  render() {
    return (
      <Fragment>
        <i
          onClick={this.props.onClick}
          className={"mr-2 fa fa-heart" + (!this.state.liked ? "-o" : "")}
          style={{ cursor: "pointer" }}
        />
        <Popup
          trigger={<a className="mr-2">{this.state.likesCount} Likes</a>}
          closeOnDocumentClick
          modal
          nested
        >
          {(close) => (
            <div className="modal m-auto" onClick={() => close()}>
              {this.state.likes}
            </div>
          )}
        </Popup>
      </Fragment>
    );
  }
}

export default Like;
