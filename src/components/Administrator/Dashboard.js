import React, { Component } from 'react';
import styled from 'styled-components';
import { Col, Row, Badge, Avatar, Tooltip, Divider } from 'antd';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import base from '../common/base';

const Main = styled.div`
  canvas {
    background-color: #ecefef;
    border-radius: 5px;
    padding: 20px;
  }
`;
const CardInfo = styled.div`
  width: 90%;
  border-radius: 5px;
  background-color: #112d3114;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 20px 0 20px;
`;

const HeaderInfo = styled.h2`
  margin-bottom: 0;
`;
const HeaderSub = styled.h5`
  padding-left: 20px;
  color: ${(props) => (props.status === 1 ? '#66bb6a' : '#f44336')};
`;

const StyledAvatar = styled(Avatar)`
  background-color: ${(props) => (props.status === 1 ? '#66bb6a' : '#ffa726')};
  color: ${(props) => (props.status === 1 ? 'white' : 'white')};
`;

const DataWrapper = styled.div`
  display: flex;
  flex-direction: 'row';
  justify-content: space-between;
  align-items: center;
`;

const DataChild = styled.div`
  margin: 20px 10px;
`;

const Data = styled.h1`
  margin-bottom: 0;
  line-height: 34px;
`;

const DataSub = styled.p`
  margin-bottom: 0;
`;

const StyledDivider = styled(Divider)`
  height: 3em !important;
  background-color: #112d31 !important;
`;

export class Dashboard extends Component {
  state = {
    data: {},
  };

  componentDidMount() {
    base.syncState('Reports', {
      context: this,
      state: 'data',
    });
  }

  render() {
    const { data } = this.state;
    const reportsToday = Object.keys(data).filter(
      (key) =>
        moment(data[key].report_date).isSame(moment(), 'day') &&
        data[key].response === 0,
    );

    const monthly = Array.apply(null, Object.keys(data)).filter(
      (key) =>
        moment(data[key].report_date).format('MM') === moment().format('MM'),
    );

    let dataSet = {};
    if (monthly.length > 0) {
      let d = [];
      monthly.map((key) => {
        // console.log(data[key].report_date);
        d = Object.keys(data).filter(
          (x) =>
            moment(data[x].report_date).format('DD') ===
            moment(data[key].report_date).format('DD'),
        );
        dataSet[
          `${moment(data[key].report_date).format('MMMM')} ${moment(
            data[key].report_date,
          ).format('DD')}, ${moment(data[key].report_date).format('YYYY')}`
        ] = d;
      });
      // d.map()
    }
    // console.log(dataSet);

    return (
      <Main>
        <h1>DASHBOARD</h1>
        <Row type="flex" gutter={16}>
          <Col span={8}>
            <Row type="flex">
              <CardInfo>
                <Header>
                  <HeaderInfo className="utility font-weight-regular">
                    {moment().format('MMM DD, YYYY')}
                  </HeaderInfo>
                  <Tooltip
                    title={`You have ${reportsToday.length} new reports today`}
                  >
                    <Badge count={reportsToday.length}>
                      {/* icon = exclamation */}
                      <StyledAvatar
                        status={reportsToday.length > 0 ? 0 : 1}
                        icon={reportsToday.length > 0 ? 'exclamation' : 'check'}
                      />
                    </Badge>
                  </Tooltip>
                </Header>
                <HeaderSub
                  className="utility font-weight-regular"
                  status={reportsToday.length > 0 ? 0 : 1}
                >
                  {reportsToday.length > 0
                    ? ' The barangay has some concerns to be addressed'
                    : 'The barangay is safe as of the moment'}
                </HeaderSub>

                <DataWrapper>
                  <DataChild>
                    <Data>{Object.keys(data).length}</Data>
                    <DataSub>total reports</DataSub>
                  </DataChild>
                  <StyledDivider type="vertical" />
                  <DataChild>
                    <Data>
                      {
                        Object.keys(data).filter(
                          (key) => data[key].response === 0,
                        ).length
                      }
                    </Data>
                    <DataSub>pending reports</DataSub>
                  </DataChild>
                  <StyledDivider type="vertical" />
                  <DataChild>
                    <Data>
                      {
                        Object.keys(data).filter(
                          (key) => data[key].response === 1,
                        ).length
                      }
                    </Data>
                    <DataSub>unsolved reports</DataSub>
                  </DataChild>
                </DataWrapper>
              </CardInfo>
            </Row>
          </Col>
          <Col span={16}>
            <Line
              data={{
                labels: Object.keys(dataSet),
                datasets: [
                  {
                    label: 'NUMBER OF REPORTS',
                    data: Object.keys(dataSet).map(
                      (key) => dataSet[key].length,
                    ),
                    borderColor: ['rgba(17, 45, 49, 0.8)'],
                  },
                ],
              }}
              options={{
                title: {
                  display: 'true',
                  text: 'MONTHLY REPORTS',
                  fontSize: 25,
                },
                legend: {
                  display: 'true',
                  position: 'bottom',
                },
                layout: {
                  padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20,
                  },
                },
              }}
            />
          </Col>
        </Row>
      </Main>
    );
  }
}

export default Dashboard;
