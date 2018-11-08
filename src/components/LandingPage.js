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
  /* align-items: center; */
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
        </HeaderWrapper>
        <LandingBody selectedPanel={this.state.selectedPanel} />
      </div>
    );
  }
}

export default LandingPage;
