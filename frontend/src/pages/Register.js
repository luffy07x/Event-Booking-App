import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[10]};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  text-align: center;
`;

const Register = () => {
  return (
    <Container>
      <Card>
        <h1>Register Page</h1>
        <p>Registration form coming soon...</p>
      </Card>
    </Container>
  );
};

export default Register;