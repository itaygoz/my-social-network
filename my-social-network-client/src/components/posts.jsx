import React, { Component, Fragment } from "react";
import Post from "./post";
import {
  getPosts,
  createPost,
  updatePostPrivate,
} from "./../services/postService";
import PostForm from "./postForm";
import auth, { getCurrentUser } from "../services/authService";

class Posts extends Component {
  state = { data: [], currentUser: null };

  static defaultProps = {
    postForm: true,
  };

  async componentDidMount() {
    const { posts } = this.props;
    const currentUser = auth.getCurrentUser();
    if (posts) return this.setState({ data: posts, currentUser });
    try {
      const { data } = await getPosts();
      this.setState({ data, currentUser });
    } catch (error) {
      if (error.response) console.log(error.response.data);
    }
  }

  handleSubmitPost = async (post, images) => {
    const formData = new FormData();

    for (const key in post) {
      formData.append(key, post[key]);
    }

    if (images)
      for (let i = 0; i < images.length; i++)
        formData.append("images", images[0]);

    const { data: result } = await createPost(formData);
    console.log(result);
    if (!result.isPrivate || this.props.posts) {
      const data = [...this.state.data];

      data.splice(0, 0, result);
      this.setState({ data });
    }
  };

  handlePrivate = async (postId) => {
    try {
      await updatePostPrivate(postId);
      const posts = this.state.data.map((p) => {
        if (p._id === postId) p.isPrivate = !p.isPrivate;

        return p;
      });

      this.setState({ data: posts });
    } catch (error) {}
  };

  render() {
    const { data, currentUser } = this.state;
    const { postForm } = this.props;
    return (
      <Fragment>
        <h1>Posts</h1>
        {postForm && currentUser && (
          <PostForm handleSubmit={this.handleSubmitPost} />
        )}
        <ul className="list-unstyled pt-3">
          {data.map((post) => (
            <li key={post._id} className="border p-3 mb-3 bg-light shadow">
              <Post post={post} handlePrivate={this.handlePrivate} />
            </li>
          ))}
        </ul>
      </Fragment>
    );
  }
}

export default Posts;
