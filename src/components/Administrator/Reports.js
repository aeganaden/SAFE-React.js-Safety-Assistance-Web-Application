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
} from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import Header from './Header';
import base from '../common/base';
import { showNotification } from '../common/helpers';
import { firebaseApp } from '../common/base';

const { TabPane } = Tabs;

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
    users: [],
    visible: false,
    urlArr: [],
    loading: false,
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

    // console.log(updatedReport);
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

  render() {
    const { reports, users, urlArr, loading } = this.state;
    console.table(reports);
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
        <Tabs defaultActiveKey="1" onChange={() => {}}>
          <TabPane
            tab={`Pending Emergencies (${
              Object.keys(reports).filter((key) => reports[key].response === 0)
                .length
            })`}
            key="1"
          >
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
                      </StyledCard>
                    </Col>
                  );
                })}
            </Row>
          </TabPane>
          <TabPane
            tab={`Solved Emergencies (${
              Object.keys(reports).filter((key) => reports[key].response === 2)
                .length
            })`}
            key="3"
          >
            <Row type="flex" gutter={32}>
              {Object.keys(reports)
                .filter((key) => reports[key].response === 2)
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
                        <HeaderWrapper>
                          <StyledHeader>
                            {moment(reports[key].report_date).format(
                              'MMM DD, YYYY - hh:mm A',
                            )}
                          </StyledHeader>
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
