import React, { Component } from 'react';
import { Menu, Avatar, Layout } from 'antd';
import { withRouter } from 'react-router';
import LOGO_PNG from '../logo.png';
import styled from 'styled-components';

const WebNavigation = styled.div`
  display: flex;
  /* flex-direction: row; */
  justify-content: space-around;
  align-items: center;
  /* width: 800 !important; */
  @media all and (max-width: 480px) {
    display: none;
  }
  /* Tablet Landscape */
  @media all and (min-width: 768px) and (max-width: 1024px) {
    display: none;
  }
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

//  MOBILE

const MobileNavigation = styled.div`
  /* Desktop Common Size */
  @media all and (min-width: 1025px) and (max-width: 1280px) {
    display: none;
  }

  /* Desktop Large Size*/
  @media all and (min-width: 1281px) {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Logo = styled.img`
  width: 50%;
  height: 50%;
`;

export class CustomNavigation extends Component {
  render() {
    return (
      <React.Fragment>
        <MobileNavigation>
          <LogoWrapper>
            <Logo src={LOGO_PNG} alt="" />
          </LogoWrapper>
        </MobileNavigation>

        <WebNavigation>
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
        </WebNavigation>
      </React.Fragment>
    );
  }
}

export default withRouter(CustomNavigation);
