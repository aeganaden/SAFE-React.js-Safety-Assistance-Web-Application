import React, { Component } from 'react';
import { Table, Tag, Button, Radio } from 'antd';
import styled from 'styled-components';
import base, { secondaryApp } from '../common/base';
import { showNotification } from '../common/helpers';

import RegistrationDrawer from '../../components/RegistrationDrawer';

import Header from './Header';
const { Column } = Table;

const Layout = styled.div``;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2%;
`;
export class Administrators extends Component {
  state = {
    data: [],
    admins: [],
    firstname: '',
    lastname: '',
    password: '',
    email: '',
    address: '',
    birthday: '',
    phone: '',
    drawerVisibility: false,
    loadingBtn: false,
  };

  onChangeInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
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
    } = this.state;
    if (
      firstname !== '' ||
      lastname !== '' ||
      email !== '' ||
      address !== '' ||
      birthday !== '' ||
      phone !== ''
    ) {
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
                status: 1,
                isAdmin: true,
              },
            })
            .then(() => {
              showNotification({
                title: 'Admin Added!',
                message: 'Admin has been successfully added to database',
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
        title: 'Oops, you missed something',
        message: 'Please fill-up all necessary fields',
        type: 'warning',
      });
      this.setState({
        loadingBtn: false,
      });
    }
  };

  updateAdminStatus = (status, email) => {
    const { data } = this.state;

    const dataKey = Object.keys(data).find((key) => data[key].email === email);
    const updatedUser = {
      ...data[dataKey],
      status,
    };
    // 1. Take a copy of the current state
    const users = { ...this.state.data };
    // 2. Update that state
    users[dataKey] = updatedUser;
    // 3. Set that to state
    this.setState({ data: users });
  };

  birthdayChangeHandler = (dateString) =>
    this.setState({ birthday: dateString });

  // componentWillMount() {
  //   base
  //     .fetch('Users', {
  //       context: this,
  //       asArray: true,
  //     })
  //     .then((data) => {
  //       const admins = [];

  //       data.map((user) => {
  //         if (user.isAdmin) {
  //           admins.push(user);
  //         }
  //       });

  //       this.setState({ admins });
  //     });
  // }

  componentDidMount() {
    base.syncState('Users', {
      context: this,
      state: 'data',
    });
  }

  render() {
    const { data, drawerVisibility, loadingBtn } = this.state;
    return (
      <React.Fragment>
        <RegistrationDrawer
          onChangeInput={this.onChangeInput}
          submitRegistration={this.submitRegistration}
          loadingBtn={loadingBtn}
          onDrawerClose={() => this.setState({ drawerVisibility: false })}
          drawerVisibility={drawerVisibility}
          birthdayChangeHandler={this.birthdayChangeHandler}
          drawerTitle="Add New Administrator"
          buttonString="SUBMIT"
        />

        <Header name="MANAGE ADMINISTRATORS" />
        <Layout>
          <ButtonWrapper>
            <Button
              icon="plus"
              onClick={() => this.setState({ drawerVisibility: true })}
            >
              ADD NEW ADMINISTRATOR
            </Button>
          </ButtonWrapper>

          <Table
            dataSource={Object.keys(data)
              .filter((x) => data[x].isAdmin)
              .map((x) => data[x])}
          >
            <Column
              title="Name"
              key="name"
              render={(text, record) => (
                <span>{`${record.fname} ${record.lname}`}</span>
              )}
            />
            <Column title="Address" dataIndex="address" key="address" />
            <Column title="Phone Number" dataIndex="phone" key="phone" />
            <Column title="Email" dataIndex="email" key="email" />
            <Column
              title="Status"
              key="status"
              render={(text, record) => {
                return (
                  <Tag color={record.status === 1 ? 'green' : 'red'}>
                    {record.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                  </Tag>
                );
              }}
            />
            <Column
              title="Action"
              key="action"
              render={(text, record) => {
                return (
                  <Radio.Group
                    defaultValue={record.status === 1 ? 'active' : 'inactive'}
                    buttonStyle="solid"
                  >
                    <Radio.Button
                      value="active"
                      onClick={() => this.updateAdminStatus(1, record.email)}
                    >
                      Active
                    </Radio.Button>
                    <Radio.Button
                      value="inactive"
                      onClick={() => this.updateAdminStatus(0, record.email)}
                    >
                      Inactive
                    </Radio.Button>
                  </Radio.Group>
                );
              }}
            />
          </Table>
        </Layout>
      </React.Fragment>
    );
  }
}

export default Administrators;
