import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Avatar,
  Button,
  Drawer,
  Input,
  Icon,
  Col,
  DatePicker,
  Divider,
} from 'antd';
import REGISTER_SVG from '../assets/vectors/register.svg';

const InputGroup = Input.Group;
const StyledDrawer = styled(Drawer)`
  .input-div {
    padding: 2% 0;
  }

  .input-div:last-child {
    margin-top: 10%;
  }
  .register-svg {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
`;

class RegistrationDrawer extends Component {
  onChangeHandler = (date, dateString) => {
    const { birthdayChangeHandler } = this.props;
    birthdayChangeHandler(dateString);
  };

  render() {
    const {
      onChangeInput,
      submitRegistration,
      loadingBtn,
      onDrawerClose,
      drawerVisibility,
      drawerTitle,
      buttonString,
    } = this.props;
    return (
      <StyledDrawer
        title={
          <div>
            <Avatar
              style={{ backgroundColor: '#112d31' }}
              size="small"
              icon="user"
            />{' '}
            {drawerTitle}
          </div>
        }
        destroyOnClose
        placement="right"
        width={500}
        onClose={() => onDrawerClose()}
        visible={drawerVisibility}
        closable
      >
        <img src={REGISTER_SVG} className="register-svg" alt="" />
        <Divider>Please fill up the form</Divider>
        <div className="input-div">
          <InputGroup>
            <Col span={12}>
              <Input
                placeholder="Enter your First Name"
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                name="firstname"
                onChange={onChangeInput}
                ref={(node) => (this.firstname = node)}
              />
            </Col>

            <Col span={12}>
              <Input
                placeholder="Enter your Last Name"
                name="lastname"
                onChange={onChangeInput}
                ref={(node) => (this.lastname = node)}
              />
            </Col>
          </InputGroup>
        </div>

        <div className="input-div">
          <Input
            placeholder="Enter your Email"
            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
            name="email"
            onChange={onChangeInput}
            ref={(node) => (this.email = node)}
          />
        </div>

        <div className="input-div">
          <Input
            placeholder="Enter Password"
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            name="password"
            type="password"
            onChange={onChangeInput}
            ref={(node) => (this.password = node)}
          />
        </div>

        <div className="input-div">
          <Input
            placeholder="Enter your Address"
            prefix={<Icon type="shop" style={{ color: 'rgba(0,0,0,.25)' }} />}
            name="address"
            onChange={onChangeInput}
            ref={(node) => (this.address = node)}
          />
        </div>

        <div className="input-div">
          <InputGroup>
            <Col span={12}>
              <DatePicker
                placeholder="Enter birth date"
                style={{ width: '100%' }}
                onChange={this.onChangeHandler}
                format="M/DD/YYYY"
                ref={(node) => (this.birthday = node)}
              />
            </Col>

            <Col span={12}>
              <Input
                placeholder="Enter Phone Number"
                name="phone"
                onChange={onChangeInput}
                maxLength={11}
                ref={(node) => (this.phone = node)}
              />
            </Col>
          </InputGroup>
        </div>

        <div className="input-div">
          <Button
            loading={loadingBtn}
            block
            type="primary"
            onClick={submitRegistration}
          >
            {buttonString}
          </Button>
        </div>
      </StyledDrawer>
    );
  }
}

RegistrationDrawer.propTypes = {
  onChangeInput: PropTypes.func,
  submitRegistration: PropTypes.func,
  loadingBtn: PropTypes.bool,
  onDrawerClose: PropTypes.func,
  birthdayChangeHandler: PropTypes.func,
  drawerVisibility: PropTypes.bool,
  drawerTitle: PropTypes.string,
  buttonString: PropTypes.string,
};

export default RegistrationDrawer;
