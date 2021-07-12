import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SIGN_IN } from '../../utils/graphql';
import useForm from '../../hooks/useForm';
import { Box, Grid, Button, TextField } from '@material-ui/core'
import { AccountCircle, Lock } from '@material-ui/icons';


const SignIn = ({ history, location, refetch }) => {
  const {inputs, handleChange} = useForm({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [signin, { loading }] = useMutation(SIGN_IN);


  useEffect(() => {
    setError('');
  }, [location.pathname]);


  const handleSubmitSignIn = async (e) => {
    e.preventDefault();
    const { email, password } = inputs;
    try {
      const response = await signin({
        variables: {  email, password  },
        // refetchQueries: [{query: GET_ALL_USERS}]
      });
      localStorage.setItem('token', response.data.signin.token);
      await refetch();
      history.push('/');
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    
    <Box>
    <form style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} onSubmit={handleSubmitSignIn}>
              {error && <>{error}</>}
        <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <AccountCircle />
            </Grid>
            <Grid item>
              <TextField 
                id="input-with-icon-grid" 
                type="text" name="email" 
                value={inputs.email} 
                label="E-mail" 
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <Lock />
            </Grid>
            <Grid item>
              <TextField 
                id="input-with-icon-grid" 
                type="password" 
                name="password" 
                value={inputs.password} 
                label="Password" 
                onChange={handleChange}
              />
            </Grid>
          </Grid>
      <Button type="submit" variant="contained">
        SignIn
      </Button>
      </form>
      </Box>
   
  );
};

SignIn.propTypes = {
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default withRouter(SignIn);