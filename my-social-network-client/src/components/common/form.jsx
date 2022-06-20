import React, { Component } from "react";
import Joi from "@hapi/joi";
import Input from "./input";
import Select from "./select";

class Form extends Component {
  state = {
    data: {},
    errors: {},
    fileField: "",
  };

  validate = () => {
    const options = {
      abortEarly: false,
    };
    const { error } = Joi.object(this.schema).validate(
      this.state.data,
      options
    );
    if (!error) return null;

    const errors = {};
    for (const item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  validatePropery = ({ name, value }) => {
    const obj = { [name]: value };

    const schema = Joi.object({ [name]: this.schema[name] });
    const { error } = schema.validate(obj);

    return error ? error.details[0].message : null;
  };

  doSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.setState({ fileField: "" });

    this.handleSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validatePropery(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  handleCheckBoxChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.checked;

    this.setState({ data });
  };

  handleFileChange = ({ currentTarget: input }) => {
    this.images = input.files;
  };

  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }

  renderTextArea(name, label) {
    return (
      <div>
        <label htmlFor={name}>{label}</label>
        <textarea
          value={this.state.data[name]}
          name={name}
          className="form-control"
          id={name}
          rows="3"
          onChange={this.handleChange}
        ></textarea>
      </div>
    );
  }

  renderFileInput(name, label) {
    const { errors, fileField } = this.state;
    return (
      <Input
        type="file"
        accept="image/*"
        name={name}
        value={fileField}
        label={label}
        error={errors[name]}
        onChange={this.handleFileChange}
      />
    );
  }

  renderCheckBox(name, label) {
    const { data } = this.state;
    return (
      <div className="form-group form-check">
        <input
          name={name}
          value={data[name]}
          onChange={this.handleCheckBoxChange}
          type="checkbox"
          className="form-check-input"
          id={name}
        />
        <label className="form-check-label" htmlFor={name}>
          {label}
        </label>
      </div>
    );
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state;
    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }
}

export default Form;
