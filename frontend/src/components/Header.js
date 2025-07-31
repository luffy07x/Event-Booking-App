import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  z-index: ${({ theme }) => theme.zIndex.fixed};
  transition: all ${({ theme }) => theme.transitions.normal};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]} 0;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: ${({ theme }) => theme.spacing[4]};
  padding-right: ${({ theme }) => theme.spacing[4]};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-left: ${({ theme }) => theme.spacing[6]};
    padding-right: ${({ theme }) => theme.spacing[6]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-left: ${({ theme }) => theme.spacing[8]};
    padding-right: ${({ theme }) => theme.spacing[8]};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

const NavLinks = styled.div`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 200px;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: none;
  border: none;
  text-align: left;
  color: ${({ theme }) => theme.colors.gray[700]};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const AuthButtons = styled.div`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const Button = styled(Link)`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: inline-block;
  text-align: center;
`;

const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[700]};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[600]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.gray[600]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <FiCalendar size={24} />
          EventHub
        </Logo>

        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/events">Events</NavLink>
        </NavLinks>

        {isAuthenticated() ? (
          <UserMenu>
            <UserButton onClick={() => setShowUserMenu(!showUserMenu)}>
              <FiUser size={16} />
              {user?.firstName} {user?.lastName}
            </UserButton>
            {showUserMenu && (
              <DropdownMenu
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DropdownItem onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }}>
                  <FiUser size={16} />
                  Dashboard
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                  <FiLogOut size={16} />
                  Logout
                </DropdownItem>
              </DropdownMenu>
            )}
          </UserMenu>
        ) : (
          <AuthButtons>
            <SecondaryButton to="/login">Login</SecondaryButton>
            <PrimaryButton to="/register">Sign Up</PrimaryButton>
          </AuthButtons>
        )}

        <MobileMenuButton onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {showMobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
        </MobileMenuButton>

        {showMobileMenu && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <NavLink to="/" onClick={() => setShowMobileMenu(false)}>Home</NavLink>
            <NavLink to="/events" onClick={() => setShowMobileMenu(false)}>Events</NavLink>
            {isAuthenticated() ? (
              <>
                <NavLink to="/dashboard" onClick={() => setShowMobileMenu(false)}>Dashboard</NavLink>
                <button onClick={handleLogout} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'inherit' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <SecondaryButton to="/login" onClick={() => setShowMobileMenu(false)}>Login</SecondaryButton>
                <PrimaryButton to="/register" onClick={() => setShowMobileMenu(false)}>Sign Up</PrimaryButton>
              </>
            )}
          </MobileMenu>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;