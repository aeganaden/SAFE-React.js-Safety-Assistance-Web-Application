import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import styled from 'styled-components';
import firebase from 'firebase';

import { showNotification } from '../common/helpers';
import LOGO_PNG from '../../logo.png';
import Login from './Login';
import { withRouter } from 'react-router-dom';

const { Sider, Content } = Layout;

const StyledLayoutWrapper = styled(Layout)`
  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  #components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
  }

  #components-layout-demo-custom-trigger .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }

  .logo-png {
    width: 100%;
  }

  .logout-btn {
    background-color: #112d31;
    color: white;
  }
`;

class Administrator extends React.Component {
  state = {
    collapsed: true,
    isAuthenticated: false,
    uid: null,
    isPageLoading: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onLoggedInSuccess = (isAuthenticated, uid) => {
    this.setState({ isAuthenticated, uid });
  };

  pageLoadingToggle = (isPageLoading) => {
    this.setState({ isPageLoading });
  };

  logoutFn = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.setState({ isAuthenticated: false });
        showNotification({ title: 'Signed out successfully.' });
      });
  };

  redirect = (route) => {
    this.props.history.push(`/${route}`);
  };

  render() {
    const { isAuthenticated } = this.state;

    if (!isAuthenticated) {
      return <Login onLoggedInSuccess={this.onLoggedInSuccess} />;
    } else {
      return (
        <StyledLayoutWrapper>
          <Sider
            theme="light"
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="logo">
              <img className="logo-png" src={LOGO_PNG} alt="" />
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={[this.props.location.pathname]}
            >
              <Menu.Item key="0" onClick={this.toggle}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                />
                <span>Toggle Menu</span>
              </Menu.Item>
              <Menu.Item
                key="/administrator"
                onClick={() => this.redirect('administrator')}
              >
                <Icon type="appstore" />
                <span>Dashboard</span>
              </Menu.Item>
              <Menu.Item
                key="/reports"
                onClick={() => this.redirect('reports')}
              >
                <Icon type="folder" />
                <span>Reports</span>
              </Menu.Item>
              <Menu.Item
                key="/manage-users"
                onClick={() => this.redirect('manage-users')}
              >
                <Icon type="user" />
                <span>Manage Users</span>
              </Menu.Item>
              <Menu.Item
                key="/manage-administrators"
                onClick={() => this.redirect('manage-administrators')}
              >
                <Icon type="team" />
                <span>Manage Admins</span>
              </Menu.Item>
              <Menu.Item key="5" className="logout-btn" onClick={this.logoutFn}>
                <Icon type="arrow-left" />
                <span>Sign Out</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                background: '#fff',
                minHeight: '100vh',
              }}
            >
              {this.props.children}
            </Content>
          </Layout>
        </StyledLayoutWrapper>
      );
    }
  }
}
export default withRouter(Administrator);
