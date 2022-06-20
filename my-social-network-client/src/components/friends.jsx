import React, { Component, Fragment } from "react";
import FriendsTable from "./friendsTable";
import {
  getCurrentUserFriends,
  deleteFriend,
  getAllFriends,
  sendFriendRequest,
} from "./../services/friendsService";
import { toast } from "react-toastify";
import _ from "lodash";
import { paginate } from "./../utils/paginate";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import queryString from "query-string";
import { getCurrentUser } from "../services/authService";

class Friends extends Component {
  state = {
    friends: [],
    pageSize: 5,
    currentPage: 1,
    sortColumn: { path: "name", order: "asc" },
    searchValue: "",
  };

  async componentDidMount() {
    if (this.props.location.search) {
      const value = queryString.parse(this.props.location.search);
      const query = value.query;
      const { data: friends } = await getAllFriends();
      this.setState({ friends, searchValue: query });
    } else {
      const { data: friends } = await getCurrentUserFriends();
      this.setState({ friends });
    }
  }

  handleDelete = async (friend) => {
    const originalFriends = [...this.state.friends];
    const friends = originalFriends.filter((v) => v._id !== friend._id);
    this.setState({ friends });

    try {
      await deleteFriend(friend._id);
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("This friend has already been deleted.");
      this.setState({ friends: originalFriends });
    }
  };

  handleAddFriend = async (friend) => {
    try {
      await sendFriendRequest(friend._id);
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("This friend has already been requested.");
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      friends,
      sortColumn,
      searchValue,
    } = this.state;

    const allFriends = friends.filter((f) => f._id !== getCurrentUser()._id);

    const searched =
      searchValue.trim() === ""
        ? allFriends
        : allFriends.filter((f) => {
            let fullName = f.firstName + " " + f.lastName;
            return _.includes(
              fullName.toLowerCase(),
              searchValue.toLowerCase()
            );
          });

    const sorted = _.orderBy(searched, [sortColumn.path], [sortColumn.order]);

    const data = paginate(sorted, currentPage, pageSize);

    return { totalCount: searched.length, data };
  };

  handleSearch = (query) => {
    this.setState({
      currentPage: 1,
      searchValue: query,
      sortColumn: { path: "name", order: "asc" },
    });
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchValue } = this.state;
    const { totalCount, data: friends } = this.getPagedData();

    if (totalCount === 0) return <p>You have no friends.</p>;
    // console.log("render friends", friends);
    return (
      <Fragment>
        <h1>Friends</h1>
        <p>You have {totalCount} friends</p>
        <SearchBox value={searchValue} onChange={this.handleSearch} />
        <FriendsTable
          friends={friends}
          sortColumn={sortColumn}
          onDelete={this.handleDelete}
          onSort={this.handleSort}
          onAddFriend={this.handleAddFriend}
        />
        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
      </Fragment>
    );
  }
}

export default Friends;
