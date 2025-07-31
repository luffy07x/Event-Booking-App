import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
`;

const BookingConfirmation = () => {
  return (
    <Container>
      <h1>Booking Confirmation</h1>
      <p>Booking confirmation coming soon...</p>
    </Container>
  );
};

export default BookingConfirmation;