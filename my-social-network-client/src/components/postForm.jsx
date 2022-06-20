import React from "react";
import Form from "./common/form";
import Joi from "@hapi/joi";

class PostForm extends Form {
  state = {
    data: { content: "", isPrivate: false },
    errors: {},
  };
  images = null;

  schema = {
    content: Joi.string().required().min(2).label("Content"),
    isPrivate: Joi.boolean(),
    images: Joi.any(),
  };

  handleSubmit = () => {
    this.props.handleSubmit(
      { ...this.state.data },
      this.images ? [...this.images] : null
    );
    this.images = null;
    this.setState({ data: { content: "", isPrivate: false } });
  };

  render() {
    return (
      <form onSubmit={this.doSubmit} encType="multipart/form-data">
        {this.renderTextArea("content", "Content")}
        {this.renderFileInput("images", "Upload Images")}
        {this.renderCheckBox("isPrivate", "Private")}
        {this.renderButton("Post")}
      </form>
    );
  }
}

export default PostForm;
