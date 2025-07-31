import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
`;

const EventDetail = () => {
  return (
    <Container>
      <h1>Event Detail</h1>
      <p>Event details coming soon...</p>
    </Container>
  );
};

export default EventDetail;