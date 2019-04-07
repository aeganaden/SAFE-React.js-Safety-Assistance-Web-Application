import React, { Component } from 'react';
import {
  Tabs,
  Card,
  Button,
  Divider,
  Row,
  Col,
  Badge,
  Icon,
  Tag,
  Modal,
  Carousel,
  Spin,
  Popconfirm,
  message,
  Menu,
  Dropdown,
  DatePicker,
} from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import Header from './Header';
import base from '../common/base';
import { showNotification } from '../common/helpers';
import { firebaseApp } from '../common/base';

import EMPTY_SVG from '../../assets/vectors/empty.svg';

const { TabPane } = Tabs;
const { MonthPicker, WeekPicker } = DatePicker;

const StyledCard = styled(Card)`
  margin-left: 10px;
`;

const StyledDivider = styled(Divider)`
  margin: 14px 0 !important;
`;
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const StyledHeader = styled.p`
  margin-bottom: 0;
  font-size: 26px;
`;

const ReportDescription = styled.p`
  font-size: 18px;
  text-align: center;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;

const StyledTitle = styled.h4`
  text-transform: capitalize;
  white-space: pre-wrap;
`;

const ReportTypeWrapper = styled.div`
  /* margin-top: 15px; */

  .ant-tag {
    margin-bottom: 20px;
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }
`;

const fetchImage = async (key) => {
  let returnURL = '';
  await firebaseApp
    .storage()
    .ref(`report_image/${key}.jpg`)
    .getDownloadURL()
    .then((url) => {
      returnURL = url;
    });

  return returnURL;
};

export class Reports extends Component {
  state = {
    reports: [],
    reportsCopy: [],
    users: [],
    visible: false,
    urlArr: [],
    loading: false,
    dateFilter: 0,
  };

  componentWillMount() {
    // Don't make Reports state as array due to syncstate problem
    // it will create new children in firebase with index as key
    base.syncState(`Reports`, {
      context: this,
      state: 'reports',
    });
    base.bindToState(`Users`, {
      context: this,
      state: 'users',
      asArray: true,
    });

    base.bindToState('Reports', {
      context: this,
      state: 'reportsCopy',
    });
  }

  degreeSwitch = (degree) => {
    switch (degree) {
      case 1:
        return <Badge status="success" text="Minor" />;
        break;
      case 2:
        return <Badge status="warning" text="Moderate" />;
        break;

      case 3:
        return <Badge status="error" text="Critical" />;
        break;

      default:
        break;
    }
  };

  respondToReport = (reportKey) => {
    const { reports } = this.state;
    const dataKey = Object.keys(reports).find((key) => key === reportKey);
    const updatedReport = {
      ...reports[dataKey],
      response: 1,
      response_date: moment().format('YYYY-MM-DD hh:mm:ss A'),
    };

    // 1. Take a copy of the current state
    const reportsCopy = { ...this.state.reports };
    //   // 2. Update that state
    reportsCopy[dataKey] = updatedReport;
    //   // 3. Set that to state
    this.setState({ reports: reportsCopy });

    showNotification({
      title: 'Responded to emergency!',
      message:
        'This report will now be moved to responded emergencies and will remain unsolved until the case is finished',
      type: 'success',
    });
  };

  solveReport = (reportKey) => {
    const { reports } = this.state;
    const dataKey = Object.keys(reports).find((key) => key === reportKey);
    const updatedReport = {
      ...reports[dataKey],
      response: 2,
      solve_date: moment().format('YYYY-MM-DD hh:mm:ss A'),
    };

    const reportsCopy = { ...this.state.reports };
    reportsCopy[dataKey] = updatedReport;
    this.setState({ reports: reportsCopy });

    showNotification({
      title: 'Good Job!',
      message: 'This report has now been solved and will be archived',
      type: 'success',
    });
  };

  showModalImages = async (key) => {
    this.setState({
      visible: true,
      loading: true,
    });
    // console.log(key);
    const urlArr = [];
    await fetchImage(`${key}_1`)
      .then((url) => urlArr.push(url))
      .catch((e) => console.log(e));
    await fetchImage(`${key}_2`)
      .then((url) => urlArr.push(url))
      .catch((e) => console.log(e));

    this.setState({ urlArr, loading: false });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  changeDateFilter = (e) => {
    this.setState({
      dateFilter: e.key,
    });
  };

  filterDates = (dateObj, format) => {
    const { reports } = this.state;
    let filterDates = {};
    Object.keys(reports).forEach((key) => {
      if (
        moment(reports[key].report_date).format(format) ===
        moment(dateObj).format(format)
      ) {
        filterDates[key] = reports[key];
      }
    });

    return filterDates;
  };

  filterByMonth = (dateObj) => {
    const filteredReports = this.filterDates(dateObj, 'MM-YYYY');
    this.setState({ reportsCopy: filteredReports });
  };

  filterByWeek = (dateObj) => {
    const filteredReports = this.filterDates(dateObj, 'WW');
    this.setState({ reportsCopy: filteredReports });
  };

  filterByDate = (dateObj) => {
    const filteredReports = this.filterDates(dateObj, 'MM-DD-YYYY');
    this.setState({ reportsCopy: filteredReports });
  };

  filterReportTypes = (type) => {
    const { reportsCopy } = this.state;
    let filteredReports = {};

    if (type !== 'others') {
      Object.keys(reportsCopy).forEach((key) => {
        if (reportsCopy[key].report_type === type) {
          filteredReports[key] = reportsCopy[key];
        }
      });
    } else {
      Object.keys(reportsCopy).forEach((key) => {
        if (
          reportsCopy[key] !== 'Fire' &&
          reportsCopy[key] !== 'Brawl' &&
          reportsCopy[key] !== 'Gunfight' &&
          reportsCopy[key] !== 'Robbery'
        ) {
          filteredReports[key] = reportsCopy[key];
        }
      });
    }

    this.setState({ reportsCopy: filteredReports });
  };

  reportTypeFilter = (e) => {
    switch (e.item.props.children[1]) {
      case 'Fire':
        this.filterReportTypes('Fire');
        break;

      case 'Brawl':
        this.filterReportTypes('Brawl');

        break;

      case 'Gunfight/Gunshot':
        this.filterReportTypes('Gunfight');

        break;
      case 'Robbery':
        this.filterReportTypes('Robbery');

        break;

      default:
        this.filterReportTypes('others');
        break;
    }
  };

  render() {
    const {
      reports,
      reportsCopy,
      dateFilter,
      users,
      urlArr,
      loading,
    } = this.state;
    console.table(reportsCopy);
    let user = {};
    let otherType = '';
    return (
      <div>
        <StyledModal
          title="Image Report"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[
            <Button type="primary" key={1} onClick={this.handleCancel}>
              Close
            </Button>,
          ]}
        >
          <Spin spinning={loading}>
            <Carousel>
              {urlArr.length !== 0
                ? urlArr.map((url, index) => <img key={index} src={url} />)
                : loading === false && (
                    <center>
                      <h3> No Image Available</h3>
                    </center>
                  )}
            </Carousel>
          </Spin>
        </StyledModal>
        <Header name="REPORTS" />
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={`Pending Emergencies (${
              Object.keys(reports).filter((key) => reports[key].response === 0)
                .length
            })`}
            key="1"
          >
            {Object.keys(reports).filter((key) => reports[key].response === 0) <
              1 && (
              <Row type="flex" justify="center">
                <Col span="6">
                  <img
                    src={EMPTY_SVG}
                    style={{ width: '100%', paddingTop: '50px' }}
                    alt=""
                  />
                  <h1>It's seems to be Empty here..</h1>
                </Col>
              </Row>
            )}
            <Row type="flex" gutter={32}>
              {Object.keys(reports)
                .filter((key) => reports[key].response === 0)
                .sort(
                  (a, b) =>
                    moment(b.report_date).format('x') -
                    moment(a.report_date).format('x'),
                )
                .map((key, index) => {
                  user = users.find((d) => d.email === reports[key].email);
                  return (
                    <Col span={8} key={index} style={{ marginTop: '10px' }}>
                      <StyledCard>
                        {/* add carousel here */}
                        <HeaderWrapper>
                          <StyledHeader>
                            {moment(reports[key].report_date).format(
                              'MMM DD, YYYY - hh:mm A',
                            )}
                          </StyledHeader>
                          {/* {this.degreeSwitch(reports[key].degree)} */}
                        </HeaderWrapper>
                        <StyledDivider />

                        <StyledTitle>
                          <Icon type="environment" theme="outlined" />{' '}
                          {!reports[key].incident_place
                            ? 'Not Defined'
                            : reports[key].incident_place}
                        </StyledTitle>
                        <StyledTitle>
                          <Icon type="user" theme="outlined" />{' '}
                          {user !== undefined
                            ? `${user.fname} ${user.lname}`
                            : ''}
                        </StyledTitle>
                        <ReportTypeWrapper>
                          {reports[key].report_type
                            .split(',')
                            .map((type, index) => {
                              switch (type) {
                                case 'Fire':
                                  return (
                                    <Tag key={index} color="red">
                                      Fire
                                    </Tag>
                                  );
                                  break;

                                case 'Brawl':
                                  return (
                                    <Tag key={index} color="volcano">
                                      Brawl
                                    </Tag>
                                  );

                                  break;

                                case 'Gunfight/Gunshot':
                                  return (
                                    <Tag key={index} color="orange">
                                      Gunfight/Gunshot
                                    </Tag>
                                  );

                                  break;
                                case 'Robbery':
                                  return (
                                    <Tag key={index} color="magenta">
                                      Robbery
                                    </Tag>
                                  );

                                  break;
                                default:
                                  otherType = type;
                                  return null;
                                  break;
                              }
                            })}
                          <ReportDescription key={index}>
                            "{otherType}"
                          </ReportDescription>
                        </ReportTypeWrapper>

                        <Popconfirm
                          title="Are you sure to Respond to this Emergency?"
                          onConfirm={() => this.respondToReport(key)}
                          onCancel={() => message.info('Response Cancelled')}
                          okText="Respond"
                          cancelText="Cancel"
                        >
                          <StyledButton type="primary" block>
                            RESPOND
                          </StyledButton>
                        </Popconfirm>
                        <StyledButton
                          type="secondary"
                          block
                          onClick={() => this.showModalImages(key)}
                        >
                          VIEW IMAGE
                        </StyledButton>
                      </StyledCard>
                    </Col>
                  );
                })}
            </Row>
          </TabPane>
          <TabPane
            tab={`Responded Emergencies (${
              Object.keys(reports).filter((key) => reports[key].response === 1)
                .length
            })`}
            key="2"
          >
            {Object.keys(reports).filter((key) => reports[key].response === 1) <
              1 && (
              <Row type="flex" justify="center">
                <Col span="6">
                  <img
                    src={EMPTY_SVG}
                    style={{ width: '100%', paddingTop: '50px' }}
                    alt=""
                  />
                  <h1>It's seems to be Empty here..</h1>
                </Col>
              </Row>
            )}
            <Row type="flex" gutter={32}>
              {Object.keys(reports)
                .filter((key) => reports[key].response === 1)
                .sort(
                  (a, b) =>
                    moment(b.report_date).format('x') -
                    moment(a.report_date).format('x'),
                )
                .map((key, index) => {
                  user = users.find((d) => d.email === reports[key].email);
                  return (
                    <Col span={8} key={index}>
                      <StyledCard>
                        <HeaderWrapper>
                          <StyledHeader>
                            {moment(reports[key].report_date).format(
                              'MMM DD, YYYY - hh:mm A',
                            )}
                          </StyledHeader>
                          {/* {this.degreeSwitch(reports[key].degree)} */}
                        </HeaderWrapper>
                        <StyledDivider />

                        <StyledTitle>
                          <Icon type="environment" theme="outlined" />{' '}
                          {!reports[key].incident_place
                            ? 'Not Defined'
                            : reports[key].incident_place}
                        </StyledTitle>
                        <StyledTitle>
                          <Icon type="user" theme="outlined" />{' '}
                          {user !== undefined
                            ? `${user.fname} ${user.lname}`
                            : ''}
                        </StyledTitle>
                        <ReportTypeWrapper>
                          {reports[key].report_type
                            .split(',')
                            .map((type, index) => {
                              switch (type) {
                                case 'Fire':
                                  return (
                                    <Tag key={index} color="red">
                                      Fire
                                    </Tag>
                                  );
                                  break;

                                case 'Brawl':
                                  return (
                                    <Tag key={index} color="volcano">
                                      Brawl
                                    </Tag>
                                  );

                                  break;

                                case 'Gunfight/Gunshot':
                                  return (
                                    <Tag key={index} color="orange">
                                      Gunfight/Gunshot
                                    </Tag>
                                  );

                                  break;
                                case 'Robbery':
                                  return (
                                    <Tag key={index} color="magenta">
                                      Robbery
                                    </Tag>
                                  );

                                  break;
                                default:
                                  return (
                                    <ReportDescription key={index}>
                                      "{type}"
                                    </ReportDescription>
                                  );
                                  break;
                              }
                            })}
                        </ReportTypeWrapper>
                        <Popconfirm
                          title="Sure? Are you done with this Report?"
                          onConfirm={() => this.solveReport(key)}
                          okText="Yes"
                          cancelText="Cancel"
                        >
                          <StyledButton type="primary" block>
                            SOLVED (DONE)
                          </StyledButton>
                        </Popconfirm>
                        <StyledButton
                          type="secondary"
                          block
                          onClick={() => this.showModalImages(key)}
                        >
                          VIEW IMAGE
                        </StyledButton>
                      </StyledCard>
                    </Col>
                  );
                })}
            </Row>
          </TabPane>
          <TabPane
            tab={`Solved Emergencies (${
              Object.keys(reportsCopy).filter(
                (key) => reportsCopy[key].response === 2,
              ).length
            })`}
            key="3"
          >
            <Row type="flex" gutter="24">
              <Col>
                <Dropdown
                  overlay={
                    <Menu onClick={this.reportTypeFilter}>
                      <Menu.Item key="1">
                        <Icon type="minus" style={{ color: 'red' }} />
                        Fire
                      </Menu.Item>
                      <Menu.Item key="2">
                        <Icon type="minus" style={{ color: 'volcano' }} />
                        Brawl
                      </Menu.Item>
                      <Menu.Item key="3">
                        <Icon type="minus" style={{ color: 'orange' }} />
                        Gunfight/Gunshot
                      </Menu.Item>
                      <Menu.Item key="4">
                        <Icon type="minus" style={{ color: 'magenta' }} />
                        Robbery
                      </Menu.Item>
                      <Menu.Item key="5">
                        <Icon type="minus" style={{ color: 'chocolate' }} />
                        Others
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button style={{ marginLeft: 8 }}>
                    <Icon type="filter" /> Report Type Filters{' '}
                    <Icon type="down" />
                  </Button>
                </Dropdown>
              </Col>
              <Col>
                <Dropdown
                  overlay={
                    <Menu onClick={this.changeDateFilter}>
                      <Menu.Item key="1">
                        <Icon type="calendar" />
                        Filter by Month
                      </Menu.Item>
                      <Menu.Item key="2">
                        <Icon type="calendar" />
                        Filter by Week
                      </Menu.Item>
                      <Menu.Item key="3">
                        <Icon type="calendar" />
                        Filter by Day
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button style={{ marginLeft: 8 }}>
                    <Icon type="filter" /> Date Filters <Icon type="down" />
                  </Button>
                </Dropdown>
              </Col>

              <Col>
                {dateFilter == 1 && (
                  <MonthPicker
                    onChange={(e) => this.filterByMonth(e)}
                    placeholder="Select month"
                  />
                )}
                {dateFilter == 2 && (
                  <WeekPicker
                    onChange={(e) => this.filterByWeek(e)}
                    placeholder="Select week"
                  />
                )}
                {dateFilter == 3 && (
                  <DatePicker
                    onChange={(e) => this.filterByDate(e)}
                    placeholder="Select date"
                  />
                )}
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() => this.setState({ reportsCopy: reports })}
                >
                  {' '}
                  remove filters
                </Button>
              </Col>
            </Row>
            {Object.keys(reportsCopy).filter(
              (key) => reportsCopy[key].response === 2,
            ) < 1 && (
              <Row type="flex" justify="center">
                <Col span="6">
                  <img
                    src={EMPTY_SVG}
                    style={{ width: '100%', paddingTop: '50px' }}
                    alt=""
                  />
                  <center>
                    <h2>It's seems to be Empty here..</h2>
                    <h2> Try adjusting your filters.</h2>
                  </center>
                </Col>
              </Row>
            )}
            <Row type="flex" gutter={32}>
              {Object.keys(reportsCopy)
                .filter((key) => reportsCopy[key].response === 2)
                .sort(
                  (a, b) =>
                    moment(b.report_date).format('x') -
                    moment(a.report_date).format('x'),
                )
                .map((key, index) => {
                  user = users.find((d) => d.email === reportsCopy[key].email);
                  return (
                    <Col span={8} key={index} style={{ marginTop: '10px' }}>
                      <StyledCard>
                        <HeaderWrapper>
                          <StyledHeader>
                            {moment(reportsCopy[key].report_date).format(
                              'MMM DD, YYYY - hh:mm A',
                            )}
                          </StyledHeader>
                        </HeaderWrapper>
                        <StyledDivider />

                        <StyledTitle>
                          <Icon type="environment" theme="outlined" />{' '}
                          {!reportsCopy[key].incident_place
                            ? 'Not Defined'
                            : reportsCopy[key].incident_place}
                        </StyledTitle>
                        <StyledTitle>
                          <Icon type="user" theme="outlined" />{' '}
                          {user !== undefined
                            ? `${user.fname} ${user.lname}`
                            : ''}
                        </StyledTitle>
                        <ReportTypeWrapper>
                          {reportsCopy[key].report_type
                            .split(',')
                            .map((type, index) => {
                              switch (type) {
                                case 'Fire':
                                  return (
                                    <Tag key={index} color="red">
                                      Fire
                                    </Tag>
                                  );
                                  break;

                                case 'Brawl':
                                  return (
                                    <Tag key={index} color="volcano">
                                      Brawl
                                    </Tag>
                                  );

                                  break;

                                case 'Gunfight/Gunshot':
                                  return (
                                    <Tag key={index} color="orange">
                                      Gunfight/Gunshot
                                    </Tag>
                                  );

                                  break;
                                case 'Robbery':
                                  return (
                                    <Tag key={index} color="magenta">
                                      Robbery
                                    </Tag>
                                  );

                                  break;
                                default:
                                  return (
                                    <ReportDescription key={index}>
                                      "{type}"
                                    </ReportDescription>
                                  );
                                  break;
                              }
                            })}
                        </ReportTypeWrapper>
                        <StyledButton
                          type="secondary"
                          block
                          onClick={() => this.showModalImages(key)}
                        >
                          VIEW IMAGE
                        </StyledButton>
                      </StyledCard>
                    </Col>
                  );
                })}
            </Row>
          </TabPane>
        </Tabs>
        ,
      </div>
    );
  }
}

export default Reports;
