import React, { Component, Fragment } from "react";
import FriendsTable from "./friendsTable";
import {
  deleteFriend,
  getAllFriends,
  sendFriendRequest,
  approveFriendRequest,
} from "./../services/friendsService";
import { toast } from "react-toastify";
import _ from "lodash";
import { paginate } from "./../utils/paginate";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import queryString from "query-string";
import { getCurrentUser } from "../services/authService";

class Members extends Component {
  state = {
    members: [],
    pageSize: 5,
    currentPage: 1,
    sortColumn: { path: "name", order: "asc" },
    searchValue: "",
  };

  componentDidUpdate(prevProps, prevState) {
    const newQuery = queryString.parse(this.props.location.search).query;
    const oldQuery = queryString.parse(prevProps.location.search).query;

    if (newQuery !== oldQuery) {
      this.setState({ searchValue: newQuery });
    }
  }

  async componentDidMount() {
    const { data: originalMembers } = await getAllFriends();
    const members = originalMembers.filter(
      (m) => m._id !== getCurrentUser()._id
    );

    if (this.props.location.search) {
      const value = queryString.parse(this.props.location.search);
      const query = value.query;
      this.setState({
        members,
        searchValue: query,
      });
    }
    this.setState({ members });
  }

  handleAddFriend = async (friend) => {
    try {
      await sendFriendRequest(friend._id);
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("This friend has already been requested.");
    }
  };

  handleApproveFriend = async (friend) => {
    try {
      await approveFriendRequest(friend._id);
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("This friend has already been approved.");
    }
  };

  handleDeleteFriend = async (friend) => {
    try {
      await deleteFriend(friend._id);
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("This friend has already been deleted.");
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
      members: allMembers,
      sortColumn,
      searchValue,
    } = this.state;

    const searched =
      searchValue.trim() === ""
        ? allMembers
        : allMembers.filter((f) => {
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

    return (
      <Fragment>
        <h1>Members</h1>
        <SearchBox value={searchValue} onChange={this.handleSearch} />
        {totalCount > 0 && (
          <Fragment>
            <FriendsTable
              friends={friends}
              sortColumn={sortColumn}
              onDelete={this.handleDeleteFriend}
              onSort={this.handleSort}
              onAddFriend={this.handleAddFriend}
              onApprove={this.handleApproveFriend}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </Fragment>
        )}
        {totalCount === 0 && <p>No member found.</p>}
      </Fragment>
    );
  }
}

export default Members;
