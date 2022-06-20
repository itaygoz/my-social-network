import React, { Component } from "react";
import Media from "./common/media";
import logo from "../logo.svg";
import { makeAvatarUrl } from "../utils/images";
import _ from "lodash";
import { getAvatar } from "../services/avatarService";
import { makeFormatDate } from "../utils/dateFormat";

class Comment extends Component {
  state = { avatar: {} };
  componentDidMount = async () => {
    const { data: avatar } = await getAvatar(this.props.comment.user._id);
    this.setState({ avatar });
  };
  render() {
    const { avatar } = this.state;
    const { comment: c } = this.props;
    return (
      <div className="border m-2 shadow">
        <Media
          key={c._id}
          title={c.user.firstName + " " + c.user.lastName}
          body={c.content}
          avatar={!_.isEmpty(avatar) ? makeAvatarUrl(avatar) : logo}
          sidebar={
            <div className="row text-sm">
              <em>{`${makeFormatDate(c.date)}`}</em>
            </div>
          }
        />
      </div>
    );
  }
}

export default Comment;
