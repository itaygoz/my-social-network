import React, { Component, Fragment } from "react";
import _ from "lodash";
import { getAvatar } from "./../services/avatarService";
import logo from "../logo.svg";
import Like from "./common/like";
import Media from "./common/media";
import { getPostImages } from "./../services/postService";
import { makeImagesUrls, makeAvatarUrl } from "./../utils/images";
import { createComment } from "../services/commentService";
import Comment from "./comment";
import { makeFormatDate } from "../utils/dateFormat";
import { postLike } from "../services/likeService";
import { getCurrentUser } from "../services/authService";

class Post extends Component {
  state = {
    avatar: {},
    images: [],
    comments: this.props.post.comments,
    commentData: "",
  };

  async componentDidMount() {
    const { post } = this.props;
    try {
      const { data: avatar } = await getAvatar(post.user._id);
      const { data: images } = await getPostImages(post._id);
      this.setState({ avatar, images });
    } catch (error) {}
  }

  onCommentChanged = (value) => {
    this.setState({ commentData: value });
  };

  onLikeClicked = async () => {
    await postLike(this.props.post._id);
  };

  renderFooter = () => {
    return (
      <form className="form">
        <div className="row pt-3 ">
          <div className="col-2 mt-1">
            {/* <Like
              postId={this.props.post._id}
              onClick={() => this.onLikeClicked()}
            /> */}
          </div>
          <div className="col input-group mr-5">
            <input
              type="text"
              className="form-control"
              id="inlineFormInputName2"
              placeholder="Comment..."
              value={this.state.commentData}
              onChange={(e) => this.onCommentChanged(e.currentTarget.value)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.handleSubmitComment}
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  };

  handleSubmitComment = async () => {
    const { commentData: commentContent } = this.state;
    if (!commentContent) return;

    const { data: result } = await createComment(
      this.props.post._id,
      commentContent
    );
    console.log(result);
    const comments = [result, ...this.state.comments];
    this.setState({ comments, commentData: "" });
    console.log("Comments array", this.state.comments);
  };

  renderSideBar = () => {
    const { date, isPrivate, _id, user } = this.props.post;
    return (
      <Fragment>
        {
          <div className="row">
            <i
              onClick={() => this.props.handlePrivate(_id)}
              className={
                "mx-auto " +
                (isPrivate
                  ? "fa fa-lock"
                  : getCurrentUser() && getCurrentUser()._id === user._id
                  ? "fa fa-key"
                  : "")
              }
            ></i>
          </div>
        }
        <div className="row text-sm">
          <em>{`${makeFormatDate(date)}`}</em>
        </div>
      </Fragment>
    );
  };

  render() {
    const { user, content } = this.props.post;
    const { avatar, images, comments } = this.state;

    return (
      <Fragment>
        <Media
          title={user.firstName + " " + user.lastName}
          body={content}
          avatar={!_.isEmpty(avatar) ? makeAvatarUrl(avatar) : logo}
          footer={this.renderFooter()}
          sidebar={this.renderSideBar()}
          images={makeImagesUrls(images)}
        />
        {comments.length > 0 && (
          <ul className="list-unstyled shadow ml-5">
            <li className="mt-3 p-3 border">
              {comments.map((c) => (
                <Comment key={c._id} comment={c} />
              ))}
            </li>
          </ul>
        )}
      </Fragment>
    );
  }
}

export default Post;
