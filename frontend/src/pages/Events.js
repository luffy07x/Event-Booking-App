import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
`;

const Events = () => {
  return (
    <Container>
      <h1>Events</h1>
      <p>Events listing coming soon...</p>
    </Container>
  );
};

export default Events;