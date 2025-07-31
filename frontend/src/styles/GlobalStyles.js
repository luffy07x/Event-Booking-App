import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSizes.base};
    font-weight: ${({ theme }) => theme.typography.fontWeights.normal};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
    color: ${({ theme }) => theme.colors.gray[800]};
    background-color: ${({ theme }) => theme.colors.white};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeights.tight};
    color: ${({ theme }) => theme.colors.gray[900]};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSizes['4xl']};
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
    margin-bottom: ${({ theme }) => theme.spacing[5]};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    margin-bottom: ${({ theme }) => theme.spacing[3]};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.fontSizes.base};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.gray[600]};
  }

  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primary[700]};
    }

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
      outline-offset: 2px;
    }
  }

  button {
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    border: none;
    background: none;
    transition: all ${({ theme }) => theme.transitions.fast};

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
      outline-offset: 2px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing[3]};
    transition: border-color ${({ theme }) => theme.transitions.fast};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    }

    &:disabled {
      background-color: ${({ theme }) => theme.colors.gray[100]};
      cursor: not-allowed;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ul, ol {
    list-style: none;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing[4]};

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
      padding: 0 ${({ theme }) => theme.spacing[6]};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      padding: 0 ${({ theme }) => theme.spacing[8]};
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  // Toast notifications custom styles
  .Toastify__toast {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
  }

  .Toastify__toast--success {
    background-color: ${({ theme }) => theme.colors.success};
  }

  .Toastify__toast--error {
    background-color: ${({ theme }) => theme.colors.error};
  }

  .Toastify__toast--warning {
    background-color: ${({ theme }) => theme.colors.warning};
  }

  // Custom scrollbar
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[400]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray[500]};
  }
`;