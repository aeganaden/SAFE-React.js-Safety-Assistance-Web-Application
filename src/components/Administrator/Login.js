import React, { Component } from 'react';
import firebase from 'firebase';
import styled from 'styled-components';
import { Input, Icon, Button } from 'antd';
import { withRouter } from 'react-router';

import { showNotification } from '../common/helpers';
import base from '../common/base';

const LoginWrapper = styled.div`
  background-color: #112d31;
  height: 100vh;

  display: flex;
  align-items: center;
  flex-direction: column;
`;

const LogoWrapper = styled.div`
  display: flex;
  background-color: white;
  justify-content: center;
  align-items: center;
  width: 2.5vw;
  height: 2.5vw;
  border-radius: 5px;
  margin: 5% 0;
  cursor: pointer;
  .letter {
    margin-bottom: 0;
  }
`;

const LoginCard = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: white;
  height: 60%;
  border-radius: 10px;
  width: 60%;
  overflow-y: hidden;

  .logo-png {
    /* background: url('https://ununsplash.imgix.net/photo-1427434846691-47fc561d1179?dpr=2&fit=crop&fm=jpg&h=700&q=75&w=1050')
      center no-repeat; */
    height: 100%;
    clip-path: circle(60% at 0 54%);
  }

  .image-bg {
    width: 50%;
  }

  .login-input {
    position: relative;
    width: 50%;
    margin-top: 10%;
  }

  .login-text .adminstrator-text {
    margin-bottom: 0;
    line-height: 0.8;
  }

  .login-input-content {
    margin-top: 3%;
  }

  .login-input-button {
    margin-top: 5%;
  }
`;

export class Login extends Component {
  state = {
    email: '',
    password: '',
    loading: false,
  };

  loginCredentialChecker = (email, uid) => {
    const { onLoggedInSuccess } = this.props;
    base.fetch(`Users`, {
      context: this,
      asArray: true,
      then(data) {
        const userData = data.find((user) => user.email === email);

        if (userData.isAdmin) {
          if (userData.status === 1) {
            showNotification({
              title: `Welcome Back, ${userData.fname}`,
              message: `Sucessfully signed In as Admin`,
              type: 'success',
            });

            this.setState({ loading: false }, onLoggedInSuccess(true, uid));
          } else {
            showNotification({
              title: `Unauthorized Access.`,
              message: `Your account has been disabled by the administrator.`,
              type: 'warning',
            });
            this.setState({ loading: false });
            firebase.auth().signOut();
          }
        } else {
          showNotification({
            title: `Unauthorized Access.`,
            message: `You're not an admin. You can access your account on our mobile platform.`,
            type: 'warning',
          });
          this.setState({ loading: false });
          firebase.auth().signOut();
        }
      },
    });
  };

  loginSubmit = () => {
    const { email, password } = this.state;
    this.setState({ loading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        showNotification({
          title: `Error (${error.code})`,
          message: `${error.message}`,
          type: 'error',
        });
        this.setState({ loading: false });
      });
  };

  onChangeInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  authListener = () => {
    firebase.auth().onAuthStateChanged((authData) => {
      if (authData) {
        this.loginCredentialChecker(authData.email, authData.uid);
      }
    });
  };

  componentWillMount() {
    this.authListener = this.authListener.bind(this);
    this.authListener();
  }

  componentWillUnmount() {
    this.fireBaseListener && this.fireBaseListener();
    this.authListener = undefined;
  }

  render() {
    return (
      <LoginWrapper>
        <LogoWrapper
          onClick={() => {
            const { history } = this.props;
            history.push('/');
          }}
        >
          <h2 className="letter">S</h2>
        </LogoWrapper>
        <LoginCard>
          <div className="image-bg">
            <img
              src="https://ununsplash.imgix.net/photo-1427434846691-47fc561d1179?dpr=2&fit=crop&fm=jpg&h=700&q=75&w=1050"
              alt=""
              className="logo-png"
            />
          </div>
          <div className="login-input">
            <div className="login-text">
              <h3 className="adminstrator-text">Administrator </h3>
              <h1>Sign in</h1>
            </div>
            <div className="login-input-content">
              <Input
                placeholder="Enter your email"
                prefix={
                  <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                name="email"
                style={{ width: '60%' }}
                onChange={this.onChangeInput}
                ref={(node) => (this.userNameInput = node)}
              />
            </div>

            <div className="login-input-content">
              <Input
                placeholder="Enter password"
                type="password"
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                name="password"
                style={{ width: '60%' }}
                onChange={this.onChangeInput}
                ref={(node) => (this.userNameInput = node)}
              />
            </div>

            <div className="login-input-button">
              <Button
                type="primary"
                loading={this.state.loading}
                onClick={this.loginSubmit}
              >
                Sign in
              </Button>
            </div>
          </div>
        </LoginCard>
      </LoginWrapper>
    );
  }
}

export default withRouter(Login);
