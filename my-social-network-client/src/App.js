import React, { Component, Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Logout from './components/common/logout';
import ProtectedRoute from './components/common/protectRoute';
import Friends from './components/friends';
import LoginForm from './components/loginForm';
import Members from './components/members';
import NavBar from './components/navBar';
import NotFound from './components/not-found';
import Posts from './components/posts';
import Profile from './components/profile';
import RegisterForm from './components/registerForm';
import auth from './services/authService';

class App extends Component {
  state = {}

  componentDidMount() {
    this.setState({ user: auth.getCurrentUser() });
  }

  render() {
    const { user } = this.state;
    return <Fragment>
      <ToastContainer />
      <NavBar user={user} />
      <main className='container p-4'>
        <Switch>
          <Route path='/profile/:id' component={Profile} />
          <ProtectedRoute path='/profile' component={Profile} />
          <ProtectedRoute path='/friends' component={Friends} />
          <Route path='/members' component={Members} />
          <Route path='/posts' component={Posts} />
          <Route path='/login' component={LoginForm} />
          <Route path='/register' component={RegisterForm} />
          <Route path='/not-found' component={NotFound} />
          <Route path='/logout' component={Logout} />
          <Redirect from='/' to='/posts' />
          <Redirect to='/not-found' />
        </Switch>
      </main>
    </Fragment>
  }
}

export default App;
