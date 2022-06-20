import _ from "lodash";
import React, { Component, Fragment } from "react";
import logo from "../logo.svg";
import auth from "../services/authService";
import { getUserById } from "../services/userService";
import { makeAvatarUrl } from "../utils/images";
import { getAvatar, getCurrentUserAvatar } from "./../services/avatarService";
import { getCurrentUserPost, getUserPost } from "./../services/postService";
import Image from "./common/image";
import Posts from "./posts";

class Profile extends Component {
  state = {
    friends: [],
    posts: null,
    user: {},
    avatar: {},
    isMe: null,
  };

  async componentDidMount() {
    const id = this.props.location.pathname.split("/")[2];
    if (id) {
      const { data: user } = await getUserById(id);
      const { data: avatar } = await getAvatar(id);
      this.setState({ user, avatar });
      try {
        const { data: posts } = await getUserPost(id);
        this.setState({ posts });
      } catch (error) {}
    } else {
      const user = auth.getCurrentUser();
      const { data: avatar } = await getCurrentUserAvatar();
      this.setState({ user, avatar, isMe: true });
      try {
        const { data: posts } = await getCurrentUserPost();
        this.setState({ posts });
      } catch (error) {}
    }
  }

  render() {
    const { user, avatar, posts, isMe } = this.state;
    return (
      <Fragment>
        <div className="row p-3 border bg-light">
          <div className="col-2">
            <Image
              alt={`${user.firstName} ${user.lastName}`}
              src={!_.isEmpty(avatar) ? makeAvatarUrl(avatar) : logo}
            />
          </div>
          <div className="col my-auto">
            <h3>{`${user.firstName} ${user.lastName}`}</h3>
          </div>
        </div>
        {posts && <Posts posts={posts} postForm={isMe} />}
        {!posts || (posts.length === 0 && <p>User does not have any posts</p>)}
      </Fragment>
    );
  }
}

export default Profile;
