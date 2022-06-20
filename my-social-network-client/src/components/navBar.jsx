import React, { Component, Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import SelectSearch from "react-select-search";
import { getAllFriends } from "../services/friendsService";
import "../../node_modules/react-select-search/style.css";
import { getCurrentUser } from "../services/authService";

class NavBar extends Component {
  state = { data: "", users: [] };

  async componentDidMount() {
    const { data: allUsers } = await getAllFriends();
    const users = allUsers
      .filter((m) => getCurrentUser() && m._id !== getCurrentUser()._id)
      .map((u) => {
        return {
          value: `${u.firstName} ${u.lastName}`,
          name: `${u.firstName} ${u.lastName}`,
        };
      });
    this.setState({ users });
  }

  onChange = (value) => {
    this.setState({ data: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.history.push("/members?query=" + this.state.data);
  };

  render() {
    const { user } = this.props;
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <NavLink className="navbar-brand" to="/">
          My Social
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse">
          <div className="navbar-nav">
            <NavLink className="nav-item nav-link" to="/posts">
              Posts
            </NavLink>
            {user && (
              <Fragment>
                <NavLink className="nav-item nav-link" to="/profile">
                  Profile
                </NavLink>
                <NavLink className="nav-item nav-link" to="/friends">
                  Friends
                </NavLink>
                <NavLink className="nav-item nav-link" to="/members">
                  Members
                </NavLink>
              </Fragment>
            )}
            {!user && (
              <Fragment>
                <NavLink className="nav-item nav-link" to="/login">
                  Login
                </NavLink>
                <NavLink className="nav-item nav-link" to="/register">
                  Register
                </NavLink>
              </Fragment>
            )}
            {user && (
              <Fragment>
                <NavLink className="nav-item nav-link" to="/profile">
                  {user.name}
                </NavLink>
                <NavLink className="nav-item nav-link" to="/logout">
                  Logout
                </NavLink>
              </Fragment>
            )}
          </div>
        </div>
        <form className="form-inline" onSubmit={this.handleSubmit}>
          {/* <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={(e) => this.onChange(e.currentTarget.value)}
          /> */}

          <SelectSearch
            printOptions="on-focus"
            onChange={(value) => this.onChange(value)}
            options={this.state.users}
            search
            emptyMessage="Not found"
            placeholder="Search..."
          />

          <button
            type="submit"
            className="btn btn-outline-success my-2 my-sm-0"
          >
            Search
          </button>
        </form>
      </nav>
    );
  }
}

export default withRouter(NavBar);
