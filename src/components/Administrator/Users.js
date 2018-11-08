import React, { Component } from 'react';
import { Table, Divider, Icon, Tabs } from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import Header from './Header';
import base from '../common/base';
import { showNotification } from '../common/helpers';

const { Column } = Table;
const { TabPane } = Tabs;

const HeaderInformation = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export class Users extends Component {
  state = {
    data: {},
  };

  acceptUser = (email) => {
    const { data } = this.state;
    const dataKey = Object.keys(data).find((key) => data[key].email === email);
    const updatedUser = {
      ...data[dataKey],
      status: 1,
    };
    // 1. Take a copy of the current state
    const users = { ...this.state.data };
    // 2. Update that state
    users[dataKey] = updatedUser;
    // 3. Set that to state
    this.setState({ data: users });

    showNotification({
      title: 'Added as new Resident',
      message:
        'A new resident has been confirmed and has been added to the database',
      type: 'success',
    });
  };

  denyUser = (email) => {
    const { data } = this.state;
    const dataKey = Object.keys(data).find((key) => data[key].email === email);
    const updatedUser = {
      ...data[dataKey],
      status: 2,
    };
    // 1. Take a copy of the current state
    const users = { ...this.state.data };
    // 2. Update that state
    users[dataKey] = updatedUser;
    // 3. Set that to state
    this.setState({ data: users });

    showNotification({
      title: 'User has been denied',
      message:
        'You have denied a specific user, this user will not have any access to the system',
      type: 'warning',
    });
  };

  componentDidMount() {
    base.syncState('Users', {
      context: this,
      state: 'data',
    });
  }

  render() {
    const { data } = this.state;

    // Object.keys(data).map((key) => {
    //   if (data[key].status === 1 && !data[key].isAdmin) {
    //     arrUsers.push(data[key]);
    //   } else if (data[key].status === 0 && !data[key].isAdmin) {
    //     arrPendUsers.push(data[key]);
    //   }
    // });

    // this.setState({ allUsers: arrUsers, pendingUsers: arrPendUsers });

    return (
      <React.Fragment>
        <Header name="MANAGE USERS" />

        <div>
          <Tabs tabPosition="top">
            <TabPane
              tab={
                <h4>
                  <Icon type="team" theme="outlined" /> TOTAL USERS (
                  {
                    Object.keys(data).filter(
                      (x) => data[x].status === 1 && !data[x].isAdmin,
                    ).length
                  }
                  )
                </h4>
              }
              key="1"
            >
              <Table
                dataSource={Object.keys(data)
                  .filter((x) => data[x].status === 1 && !data[x].isAdmin)
                  .map((x) => data[x])}
              >
                <Column
                  title="Name"
                  key="name"
                  render={(text, record) => (
                    <span>{`${record.fname} ${record.lname}`}</span>
                  )}
                />
                <Column
                  title="Age"
                  key="age"
                  render={(text, record) => {
                    const today = moment();
                    const birthdate = moment(record.birthday);

                    return <span>{today.diff(birthdate, 'years')}</span>;
                  }}
                />
                <Column title="Address" dataIndex="address" key="address" />
                <Column title="Phone Number" dataIndex="phone" key="phone" />
                <Column title="Email" dataIndex="email" key="email" />
              </Table>
            </TabPane>
            <TabPane
              tab={
                <h4>
                  <Icon type="usergroup-add" theme="outlined" /> PENDING USERS (
                  {
                    Object.keys(data).filter(
                      (x) => data[x].status === 0 && !data[x].isAdmin,
                    ).length
                  }
                  )
                </h4>
              }
              key="2"
            >
              <Table
                dataSource={Object.keys(data)
                  .filter((x) => data[x].status === 0 && !data[x].isAdmin)
                  .map((x) => data[x])}
              >
                <Column
                  title="Name"
                  key="name"
                  render={(text, record) => (
                    <span>{`${record.fname} ${record.lname}`}</span>
                  )}
                />
                <Column
                  title="Age"
                  key="age"
                  render={(text, record) => {
                    const today = moment();
                    const birthdate = moment(record.birthday);

                    return (
                      <span>
                        {today.diff(birthdate, 'years')
                          ? today.diff(birthdate, 'years')
                          : 'N/A'}
                      </span>
                    );
                  }}
                />
                <Column title="Address" dataIndex="address" key="address" />
                <Column title="Phone Number" dataIndex="phone" key="phone" />
                <Column title="Email" dataIndex="email" key="email" />
                <Column
                  title="Action"
                  key="action"
                  render={(text, record) => (
                    <span>
                      <a
                        href="javascript:;"
                        onClick={() => this.acceptUser(record.email)}
                      >
                        Accept
                      </a>
                      <Divider type="vertical" />
                      <a
                        href="javascript:;"
                        style={{ color: 'red' }}
                        onClick={() => this.denyUser(record.email)}
                      >
                        Delete
                      </a>
                    </span>
                  )}
                />
              </Table>
            </TabPane>
          </Tabs>
        </div>
      </React.Fragment>
    );
  }
}

export default Users;
