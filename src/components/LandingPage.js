import React, { Component } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

import CustomNavigation from './CustomNavigation';
import LandingBody from './LandingBody';

const HeaderWrapper = styled.div`
  height: 100vh;
  background-color: #b1d7dc;
`;

const HeaderContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: inherit;
  justify-content: center;
  width: 690px;
  margin-left: 5%;

  /*  Mobile Devices */
  @media all and (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
  /* Tablet Portrait */
  @media all and (min-width: 768px) and (max-width: 1024px) {
    display: none;
  }
`;

const HeaderAction = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Tagline = styled.div`
  font-size: 80px;

  color: #112d31;

  .emphasis {
    background-image: linear-gradient(to bottom, transparent 70%, #cfc981 40%);
    background-repeat: repeat-x;
  }
`;

const HeaderMobile = styled.div`
  padding: 0 20px;
  /* Desktop Common Size */
  @media all and (min-width: 1025px) and (max-width: 1280px) {
    display: none;
  }

  /* Desktop Large Size*/
  @media all and (min-width: 1281px) {
    display: none;
  }
`;
const HeaderTitle = styled.h1`
  font-weight: 600;
  font-size: 10vw;
  margin-top: 50px;
`;
const HeaderSubTitle = styled.div`
  text-align: justify;
`;

const HeaderMobileAction = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 70px;
`;

export class LandingPage extends Component {
  state = {
    selectedPanel: '',
  };

  onSelectMenuHandler = (selectedPanel) => {
    this.setState({ selectedPanel });
  };

  render() {
    return (
      <div>
        <HeaderWrapper>
          <CustomNavigation onSelectMenuHandler={this.onSelectMenuHandler} />
          <HeaderContentWrapper>
            <Tagline className="utility font-weight-light">
              Maintain <span className="emphasis">a much safer</span> barangay.
            </Tagline>
            <h4 className="utility font-weight-regular">
              SAFE is an acronym for Safety Assistant for Emergencies which is
              Intended for Brgy. South Daang Hari, Taguig City. It aims to
              provide an accessible platform to report an incident, accident, or
              any type of unnecessary event that may endager a person.
            </h4>
            <HeaderAction>
              <Button
                size="large"
                type="primary"
                onClick={() => this.setState({ selectedPanel: 'how-it-works' })}
              >
                Learn More
              </Button>
            </HeaderAction>
          </HeaderContentWrapper>
          {/* MOBILE */}
          <HeaderMobile>
            <HeaderTitle> PROJECT SAFE</HeaderTitle>
            <HeaderSubTitle>
              SAFE is an acronym for Safety Assistant for Emergencies which is
              Intended for Brgy. South Daang Hari, Taguig City. It aims to
              provide an accessible platform to report an incident, accident, or
              any type of unnecessary event that may endager a person.
            </HeaderSubTitle>

            <HeaderMobileAction>
              <Button
                size="large"
                type="primary"
                onClick={() => this.setState({ selectedPanel: 'how-it-works' })}
              >
                Learn More
              </Button>
            </HeaderMobileAction>
          </HeaderMobile>
        </HeaderWrapper>
        <LandingBody selectedPanel={this.state.selectedPanel} />
      </div>
    );
  }
}

export default LandingPage;
