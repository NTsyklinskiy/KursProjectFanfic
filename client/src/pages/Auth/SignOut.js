import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { useStore } from '../../store/store';
import { CLEAR_AUTH_USER } from '../../store/auth';
import {  MenuItem } from '@material-ui/core';

const SignOut = ({ history }) => {
  const client = useApolloClient();
  const [, dispatch] = useStore();

  const handleSignOut = () => {
    dispatch({ type: CLEAR_AUTH_USER });
    localStorage.removeItem('token');
    client.resetStore();
    history.push('/');
  };

  return (
    <MenuItem onClick={handleSignOut}>
      Sign out
    </MenuItem>
  );
};

SignOut.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(SignOut);
