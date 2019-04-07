import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import { Avatar, Button, BackTop, message } from 'antd';
import { withRouter } from 'react-router';

import RegistrationDrawer from '../components/RegistrationDrawer';

import base, { secondaryApp } from './common/base';
import { showNotification } from './common/helpers';

import CREATE_SVG from '../assets/vectors/create.svg';
import SETUP_SVG from '../assets/vectors/setup.svg';
import SYNC_SVG from '../assets/vectors/sync.svg';
import PHONE_SVG from '../assets/vectors/phone_pin.svg';
import COMMUNITY_SVG from '../assets/vectors/community.svg';
import LOGO_PNG from '../logo.png';
import APK from '../assets/download-apk.png';
import APK_FILE from '../assets/SAFE_v3.4.3.apk';

const keyframe_rotate_logo = keyframes`
from {
    transition:rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Panel = styled.div`
  display: flex;
  align-items: center;
  height: ${(props) => (props.height ? props.height : '')};
  padding: ${(props) => (props.padding ? props.padding : '15%')};
  background-color: ${(props) =>
    props.color ? `${props.color} !important` : 'white'};
  background-image: ${(props) =>
    props.background ? `url(${props.background})` : ' '};
  background-repeat: no-repeat;
  background-position: center;
`;

const BodyWrapper = styled.div`
  .logo-png {
    width: 500px;
  }

  .content-svg {
    width: 180px;
    transition: all 0.2s ease-in-out;

    &:hover {
      transform: rotate(-33deg) scale(1.4);
    }
  }

  .phone-svg {
    width: 500px;
  }
`;

const PanelHeaderText = styled.h1`
  font-size: 45px;
`;

const StyledAvatar = styled(Avatar)`
  background-color: ${(props) =>
    props.color ? `${props.color} !important` : 'white'};
`;

const HighlightText = styled.span`
  background-image: ${(props) =>
    props.color
      ? `linear-gradient(to bottom, transparent 70%,  ${props.color} 40%)`
      : 'linear-gradient(to bottom, transparent 70%, #cfc981 40%)'};
  transition: background-position 1s ease-out;
  background-repeat: repeat-x;

  &:hover {
    background-position: 0 -100px;
  }
`;

const HowItWorksContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const HowItWorksItem = styled.div`
  &:nth-child(-n + 3) {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 50px;
  }
`;

const HowItWorksDescription = styled.div`
  margin-left: 10px;
`;

const SecondPanelWrapper = styled.div`
  display: flex;
  flex-direction: row;

  /*  Mobile Devices */
  @media all and (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
  /* Table Portrait */
  @media all and (min-width: 768px) and (max-width: 1024px) {
    display: none;
  }
`;

const SecondPanelDescription = styled.p`
  font-size: 18px;
`;

const ThirdPanelWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;

  /*  Mobile Devices */
  @media all and (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
  /* Table Portrait */
  @media all and (min-width: 768px) and (max-width: 1024px) {
    display: none;
  }
`;

const FirstPanelWeb = styled.div`
  /*  Mobile Devices */
  @media all and (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
  /* Table Portrait */
  @media all and (min-width: 768px) and (max-width: 1024px) {
    display: none;
  }
`;

const FirstPanelMobile = styled.div`
  /* Desktop Common Size */
  @media all and (min-width: 1025px) and (max-width: 1280px) {
    display: none;
  }
  /* Desktop Large Size*/
  @media all and (min-width: 1281px) {
    display: none;
  }
`;

const SecondPanelMobile = styled.div`
  /* Desktop Common Size */
  @media all and (min-width: 1025px) and (max-width: 1280px) {
    display: none;
  }
  /* Desktop Large Size*/
  @media all and (min-width: 1281px) {
    display: none;
  }
`;

const ThirdPanelMobile = styled.div`
  /* Desktop Common Size */
  @media all and (min-width: 1025px) and (max-width: 1280px) {
    display: none;
  }
  /* Desktop Large Size*/
  @media all and (min-width: 1281px) {
    display: none;
  }
`;

const ThirdPanelStyledBG = styled.div`
  /* Table Portrait */
  @media all and (min-width: 768px) and (max-width: 1024px) {
    display: none;
  }
  /*  Mobile Devices */
  @media all and (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
`;

const firstPanelStyle = {
  background:
    'url("https://cdn2.hubspot.net/hubfs/120191/tech_super_2018/home070318/triangle-1.png?t=1536606853311")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '25% auto',
  backgroundPositionX: '-17%',
  backgroundPositionY: '30%',
  height: '100%',
  width: '100%',
};

const secondPanelStyle = {
  background:
    'url("https://cdn2.hubspot.net/hubfs/120191/tech_super_2018/home070318/triangle-2.png?t=1536606853311")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '25% auto',
  backgroundPositionY: '80%',
  height: '100%',
  width: '100%',
};

const thirdPanelStyle = {
  background:
    'url("https://cdn2.hubspot.net/hubfs/120191/tech_super_2018/home070318/triangle-1.png?t=1536606853311")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '25% auto',
  backgroundPositionY: '100%',
  backgroundPositionX: '100%',
  height: '100%',
  width: '100%',
  position: 'absolute',
};

export class LandingBody extends Component {
  constructor(props) {
    super(props);
    this.aboutPanel = React.createRef();
    this.featuresPanel = React.createRef();
    this.registerPanel = React.createRef();
  }

  state = {
    drawerVisibility: false,
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    address: '',
    birthday: '',
    phone: '',
    loadingBtn: false,
  };

  onChangeInput = (e) => {
    if (e.target.name === 'firstname' || e.target.name === 'lastname') {
      const pattern = /^[a-zA-Z]*$/;
      if (!pattern.test(e.target.value)) {
        message.warning('Numbers are not allowed in name.');
      }
    }

    if (e.target.name === 'phone') {
      const pattern = /^[1-9]*$/;
      if (!pattern.test(e.target.value)) {
        message.warning('Phone number must not contain letters');
      }
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  birthdayChangeHandler = (dateString) =>
    this.setState({ birthday: dateString });

  validateInputs = (
    firstname,
    lastname,
    password,
    email,
    address,
    birthday,
    phone,
  ) => {
    if (
      firstname === '' ||
      lastname === '' ||
      email === '' ||
      address === '' ||
      birthday === '' ||
      phone === '' ||
      password === ''
    ) {
      return false;
    }
    const fullName = firstname + lastname;
    const pattern = /^[1-9]*$/;
    const namePattern = /^[a-zA-Z]*$/;
    console.log(firstname, lastname, password, email, address, birthday, phone);
    console.log(!pattern.test(fullName));
    if (!namePattern.test(fullName)) {
      return false;
    }
    if (!pattern.test(phone)) {
      return false;
    }

    return true;
  };

  submitRegistration = () => {
    this.setState({ loadingBtn: true });
    const {
      firstname,
      lastname,
      password,
      email,
      address,
      birthday,
      phone,
      errorObject,
    } = this.state;

    if (
      this.validateInputs(
        firstname,
        lastname,
        password,
        email,
        address,
        birthday,
        phone,
      )
    ) {
      // alert('succes');
      secondaryApp
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          base
            .push(`Users`, {
              data: {
                fname: firstname,
                lname: lastname,
                email: email,
                address: address,
                birthday: birthday,
                phone: phone,
                status: 0,
                isAdmin: false,
              },
            })
            .then(() => {
              showNotification({
                title: 'Successfully Registered!',
                message:
                  'You have been regitered to our system, your account is now subject for approval for verification purposes',
                type: 'success',
              });
              this.setState({
                drawerVisibility: false,
                loadingBtn: false,
              });
              secondaryApp.auth().signOut();
            });
        })
        .catch((error) => {
          showNotification({
            title: `Error (${error.code})`,
            message: error.message,
            type: 'error',
          });
          this.setState({
            loadingBtn: false,
          });
        });
    } else {
      showNotification({
        title: 'Oops, there is an error on your form!',
        message: 'Either you missed a field, or there is a NUMBER on your name',
        type: 'warning',
      });
      // console.log(errorObject);
      this.setState({
        loadingBtn: false,
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    switch (nextProps.selectedPanel) {
      case 'about':
        const aboutElement = document.getElementById('about-panel');
        aboutElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        break;

      case 'features':
        const featureElement = document.getElementById('features-panel');
        featureElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        break;
      case 'register':
        const registerElement = document.getElementById('register-panel');
        registerElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        break;

      case 'how-it-works':
        const howItWorksElement = document.getElementById('how-it-works');
        howItWorksElement.scrollIntoView({
          block: 'start',
          behavior: 'smooth',
        });
        break;

      default:
        break;
    }
  }

  render() {
    const { drawerVisibility, loadingBtn } = this.state;

    return (
      <BodyWrapper>
        <BackTop />

        <RegistrationDrawer
          onChangeInput={this.onChangeInput}
          submitRegistration={this.submitRegistration}
          loadingBtn={loadingBtn}
          onDrawerClose={() => this.setState({ drawerVisibility: false })}
          drawerVisibility={drawerVisibility}
          birthdayChangeHandler={this.birthdayChangeHandler}
          drawerTitle="Registration"
          buttonString="REGISTER"
        />

        <Panel style={firstPanelStyle} id="how-it-works">
          <FirstPanelWeb>
            <PanelHeaderText style={{ marginBottom: '5%' }}>
              <HighlightText color="#7da3f8">How it works</HighlightText>
            </PanelHeaderText>
            <HowItWorksContentWrapper>
              <HowItWorksItem>
                <img src={CREATE_SVG} className="content-svg" alt="" />
                <HowItWorksDescription>
                  <h1 className="utility font-weight-regular">
                    <HighlightText color="#b1d7dc">CREATE</HighlightText>
                  </h1>
                  <p>Create a report by filling up a report form indicating</p>
                  <p>
                    the type of accident and detailed explanation of the event
                  </p>
                </HowItWorksDescription>
              </HowItWorksItem>

              <div>
                <StyledAvatar color="#1f484e" size="large" icon="swap-right" />
              </div>

              <HowItWorksItem>
                <img src={SETUP_SVG} className="content-svg" alt="" />
                <HowItWorksDescription>
                  <h1 className="utility font-weight-regular">
                    <HighlightText color="#dcb1b1">SUBMIT</HighlightText>
                  </h1>
                  <p>Submit the report</p>
                </HowItWorksDescription>
              </HowItWorksItem>

              <div>
                <StyledAvatar color="#1f484e" size="large" icon="swap-right" />
              </div>

              <HowItWorksItem>
                <img src={SYNC_SVG} className="content-svg" alt="" />
                <HowItWorksDescription>
                  <h1 className="utility font-weight-regular">
                    {' '}
                    <HighlightText color="#c9dcb1">SUCCESS</HighlightText>
                  </h1>
                  <p>Your report has now been sent to the barangay officials</p>
                </HowItWorksDescription>
              </HowItWorksItem>
            </HowItWorksContentWrapper>
          </FirstPanelWeb>

          <FirstPanelMobile>
            <h1>
              <HighlightText color="#7da3f8">How it works</HighlightText>
            </h1>
            <b>
              <HighlightText color="#b1d7dc">CREATE</HighlightText>
            </b>
            <p>
              Create a report by filling up a report form indicating the type of
              accident and detailed explanation of the event
            </p>
            <br />
            <b>
              <HighlightText color="#dcb1b1">SUBMIT</HighlightText>
            </b>
            <p>Submit the report</p>
            <br />
            <b>
              <HighlightText color="#c9dcb1">SUCCESS</HighlightText>
            </b>
            <p>Your report has now been sent to the barangay officials</p>
          </FirstPanelMobile>
        </Panel>

        <Panel color="#b1d7dc" style={secondPanelStyle} id="about-panel">
          <SecondPanelWrapper>
            <div>
              <PanelHeaderText>
                <HighlightText color="#8facc9">What is this?</HighlightText>
              </PanelHeaderText>
              <SecondPanelDescription>
                The proponents chose Barangay South Daang Hari to be the
                benificiary of the application because they see the{' '}
                <HighlightText>need for innovative product</HighlightText>{' '}
                wherein it can ba utilize as the primary reporting medium within
                the barangay. Barangay South Daang Hari still uses the manual
                approach of recording an accidet, such as manually recording
                incident reports and as well as blotters, this method may not be
                effective in responding to emergencies quikly. The proponents
                can see that by{' '}
                <HighlightText>applying modern technology</HighlightText> to
                their system in barangay, the quality of life of the citizens
                living within the barangay can be enhanced, thus{' '}
                <HighlightText>
                  {' '}
                  maintaining a much safer barangay.{' '}
                </HighlightText>
              </SecondPanelDescription>
            </div>
            <div>
              <img src={LOGO_PNG} className="logo-png" alt="" />
            </div>
          </SecondPanelWrapper>

          <SecondPanelMobile>
            <h1>
              <HighlightText color="#8facc9">What is this?</HighlightText>
            </h1>
            <p>
              The proponents chose Barangay South Daang Hari to be the
              benificiary of the application because they see the{' '}
              <HighlightText>need for innovative product</HighlightText> wherein
              it can ba utilize as the primary reporting medium within the
              barangay. Barangay South Daang Hari still uses the manual approach
              of recording an accidet, such as manually recording incident
              reports and as well as blotters, this method may not be effective
              in responding to emergencies quikly. The proponents can see that
              by <HighlightText>applying modern technology</HighlightText> to
              their system in barangay, the quality of life of the citizens
              living within the barangay can be enhanced, thus{' '}
              <HighlightText>
                {' '}
                maintaining a much safer barangay.{' '}
              </HighlightText>
            </p>
          </SecondPanelMobile>
        </Panel>
        <ThirdPanelStyledBG style={thirdPanelStyle} />
        <Panel id="features-panel">
          <ThirdPanelWrapper>
            <div>
              <img src={PHONE_SVG} className="phone-svg" alt="" />
            </div>
            <div>
              <PanelHeaderText>
                <HighlightText color="#9c89d5">Features</HighlightText>
              </PanelHeaderText>
              <h3>Realtime Report and Response</h3>
              <p>
                • Submit report, view reports, respond to reports. All in
                real-time. No Delay.
              </p>
              <h3>Fast and lightweight Mobile App</h3>
              <p>
                • Created with native android application that will guarantee
                fast and lightweight Application.
              </p>
              <h3>Easy to use</h3>
              <p>
                • Easy to use User Interface that is Elderly and Non-Techy
                person Friendly
              </p>
              <h3>Secured</h3>
              <p>
                • Embedded with security features that will ensure the user's
                data security.
              </p>
              <a href={APK_FILE} download="SAFE.apk">
                <img
                  src={APK}
                  style={{
                    width: '15rem',
                    paddingTop: '2rem',
                    zIndex: '999999 !important',
                  }}
                />
              </a>
            </div>
          </ThirdPanelWrapper>
          <ThirdPanelMobile>
            <h1>
              <HighlightText color="#9c89d5">Features</HighlightText>
            </h1>
            <br />
            <h3>Realtime Report and Response</h3>
            <p>
              • Submit report, view reports, respond to reports. All in
              real-time. No Delay.
            </p>
            <h3>Fast and lightweight Mobile App</h3>
            <p>
              • Created with native android application that will guarantee fast
              and lightweight Application.
            </p>
            <h3>Easy to use</h3>
            <p>
              • Easy to use User Interface that is Elderly and Non-Techy person
              Friendly
            </p>
            <h3>Secured</h3>
            <p>
              • Embedded with security features that will ensure the user's data
              security.
            </p>

            <a href={APK_FILE} download="SAFE.apk">
              <img
                src={APK}
                style={{
                  width: '15rem',
                  paddingTop: '2rem',
                  zIndex: '999999 !important',
                }}
              />
            </a>
          </ThirdPanelMobile>
        </Panel>

        <Panel
          color="#b1d7dc"
          padding="5%"
          background={COMMUNITY_SVG}
          id="register-panel"
        >
          <div>
            <PanelHeaderText>
              <HighlightText color="#889fbd">JOIN THE COMMUNITY</HighlightText>
            </PanelHeaderText>

            <Button
              size="large"
              type="primary"
              icon="user"
              block
              onClick={() => this.setState({ drawerVisibility: true })}
            >
              REGISTER NOW
            </Button>
            <ThirdPanelMobile>
              <Button
                size="large"
                type="secondary"
                icon="login"
                block
                onClick={() => this.props.history.push('/administrator')}
                style={{
                  marginTop: '20px',
                }}
              >
                ADMINISTRATOR
              </Button>
            </ThirdPanelMobile>
          </div>
        </Panel>

        <Panel color="#112d31" height="20vh" padding="5%">
          <div>
            <p style={{ color: 'white' }}>SAFE - Accident Reporting App</p>
            <p style={{ color: 'white' }}>© 2018</p>
          </div>
        </Panel>
      </BodyWrapper>
    );
  }
}

export default withRouter(LandingBody);
