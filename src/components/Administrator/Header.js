import React from 'react';
import styled from 'styled-components';

const Header = styled.div`
  margin-bottom: 2%;
  .headerName {
    display: inline-block;
    background-color: #112d31;
    padding: 0.5% 2%;
    border-radius: 5px;

    color: #cfe7ea;
    margin-bottom: 0;
    border-left: 6px groove white;
  }
`;

export default (props) => {
  return (
    <React.Fragment>
      <Header>
        <h2 className="headerName">{props.name}</h2>
      </Header>
    </React.Fragment>
  );
};
