import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../logo.svg";
import { getAvatar } from "../services/avatarService";
import {
  getCurrentUserFriends,
  getCurrentUserPendings,
  getCurrentUserRequests,
} from "../services/friendsService";
import { makeAvatarUrl } from "../utils/images";
import Image from "./common/image";
import Table from "./common/table";

class FriendsTable extends Component {
  state = {
    currendUserFriends: [],
    currentFriendPendings: [],
    currentFriendRequests: [],
    userAvatars: [],
  };

  constructor(props) {
    super(props);
    const userAvatars = [];
    const { friends } = this.props;
    friends.forEach(async (f) => {
      const { data: avatar } = await getAvatar(f._id);
      userAvatars.push({ _id: f._id, avatar });
    });

    this.state.userAvatars = userAvatars;
  }

  async componentDidMount() {
    const { data: currendUserFriends } = await getCurrentUserFriends();
    const { data: currentFriendPendings } = await getCurrentUserRequests();
    const { data: currentFriendRequests } = await getCurrentUserPendings();

    this.setState({
      currendUserFriends,
      currentFriendPendings,
      currentFriendRequests,
    });
  }

  columns = [
    {
      key: "avatar",
      content: (friend) => {
        return this.renderAvatarCell(friend);
      },
    },
    {
      path: "name",
      label: "Name",
      content: (friend) => (
        <Link
          to={"/profile/" + friend._id}
        >{`${friend.firstName} ${friend.lastName}`}</Link>
      ),
    },
    {
      key: "info",
      content: (friend) => this.renderInfoCell(friend),
    },
  ];

  addFriend = (friend) => {
    this.props.onAddFriend(friend);
    const currentFriendPendings = [...this.state.currentFriendPendings, friend];

    this.setState({ currentFriendPendings });
  };

  removeFriend = (friend) => {
    this.props.onDelete(friend);
    const currendUserFriends = this.state.currendUserFriends.filter(
      (f) => f._id !== friend._id
    );

    this.setState({ currendUserFriends });
  };

  approveFriend = (friend) => {
    this.props.onApprove(friend);
    const currendUserFriends = [...this.state.currendUserFriends, friend];

    this.setState({ currendUserFriends });
  };

  renderInfoCell = (friend) => {
    if (
      this.state.currendUserFriends.filter((f) => f._id === friend._id)
        .length === 0 &&
      this.state.currentFriendPendings.filter((f) => f._id === friend._id)
        .length === 0 &&
      this.state.currentFriendRequests.filter((f) => f._id === friend._id)
        .length === 0
    )
      return (
        <button
          className="btn btn-primary"
          onClick={() => this.addFriend(friend)}
        >
          Add Friend
        </button>
      );
    else if (
      this.state.currentFriendPendings.filter((f) => f._id === friend._id)
        .length > 0
    )
      return (
        <div className="btn btn-info" aria-disabled>
          Pending
        </div>
      );
    else if (
      this.state.currendUserFriends.filter((f) => f._id === friend._id).length >
      0
    )
      return (
        <button
          className="btn btn-danger"
          onClick={() => this.removeFriend(friend)}
        >
          Delete
        </button>
      );
    else if (
      this.state.currentFriendRequests.filter((f) => f._id === friend._id)
        .length > 0
    )
      return (
        <button
          className="btn btn-success"
          onClick={() => this.approveFriend(friend)}
        >
          Approve
        </button>
      );
  };

  renderAvatarCell = (friend) => {
    const { userAvatars } = this.state;
    const avatar = userAvatars.find((f) => friend._id === f._id);
    if (avatar && !_.isEmpty(avatar.avatar)) {
      return (
        <Image
          alt={friend.firstName}
          src={!_.isEmpty(avatar) ? makeAvatarUrl(avatar.avatar) : logo}
        />
      );
    }
    return <Image alt={`${friend.firstName} ${friend.lastName}`} src={logo} />;
  };

  render() {
    const { friends, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={friends}
      />
    );
  }
}

export default FriendsTable;
