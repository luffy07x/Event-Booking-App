import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
`;

const Dashboard = () => {
  return (
    <Container>
      <h1>Dashboard</h1>
      <p>User dashboard coming soon...</p>
    </Container>
  );
};

export default Dashboard;