import React from "react";
import Joi from "@hapi/joi";
import Form from "./common/form";
import { register } from "../services/userService";
import auth from "../services/authService";
class RegisterForm extends Form {
  state = {
    data: { email: "", password: "", firstName: "", lastName: "" },
    errors: {},
  };

  images = null;

  schema = {
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string().required().min(5).label("Password"),
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    avatar: Joi.any(),
  };

  handleSubmit = async () => {
    try {
      const formData = new FormData();

      for (const key in this.state.data) {
        formData.append(key, this.state.data[key]);
      }
      if (this.images) formData.append("avatar", this.images[0]);

      const { headers } = await register(formData);
      auth.loginWithJwt(headers["x-auth-token"]);
      window.location = "/";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = error.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.doSubmit} encType="multipart/form-data">
          {this.renderInput("firstName", "First Name")}
          {this.renderInput("lastName", "Last Name")}
          {this.renderInput("email", "Email")}
          {this.renderInput("password", "Password", "password")}
          {this.renderFileInput("avatar", "Avatar", "file")}
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
