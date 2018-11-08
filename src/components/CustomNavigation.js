import React, { Component } from 'react';
import { Menu, Avatar } from 'antd';
import { withRouter } from 'react-router';

import styled from 'styled-components';

const CustomNavigationWrapper = styled.div`
  display: flex;
  /* flex-direction: row; */
  justify-content: space-around;
  align-items: center;
  /* width: 800 !important; */
`;

const BrandText = styled.h2`
  margin-bottom: 0;
  /* padding-left: 5%; */
`;

const BrandWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .brand-logo {
    width: 100%;
  }
`;

const BrandLogo = styled.div`
  /* width: 40px; */
  margin-right: 5%;
  .brand-icon {
    background-color: #112d31;
  }
`;

const StyledMenu = styled(Menu)`
  border-bottom: none;

  .ant-menu-item {
    background-color: transparent;
  }
`;

export class CustomNavigation extends Component {
  render() {
    return (
      <CustomNavigationWrapper>
        <BrandWrapper>
          <BrandLogo>
            <Avatar icon="usergroup-add" className="brand-icon" />
          </BrandLogo>
          <BrandText>SAFE</BrandText>
        </BrandWrapper>
        <div />
        <div />
        <StyledMenu
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px', background: 'transparent' }}
        >
          <Menu.Item
            key="1"
            onClick={() => this.props.onSelectMenuHandler('about')}
          >
            About
          </Menu.Item>
          <Menu.Item
            key="2"
            onClick={() => this.props.onSelectMenuHandler('features')}
          >
            Features
          </Menu.Item>
          <Menu.Item
            key="3"
            onClick={() => this.props.onSelectMenuHandler('register')}
          >
            Register
          </Menu.Item>

          <Menu.Item
            key="4"
            onClick={() => this.props.history.push('/administrator')}
          >
            Administrator
          </Menu.Item>
        </StyledMenu>
      </CustomNavigationWrapper>
    );
  }
}

export default withRouter(CustomNavigation);
