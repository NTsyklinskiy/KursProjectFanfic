import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button,  Form} from 'react-bootstrap'
import PropTypes from 'prop-types';
import { GET_ALL_USERS, SIGN_UP } from '../../utils/graphql';
import useForm from '../../hooks/useForm';

const SignUp = ({ history, refetch }) => {
    const [error, setError] = useState('');
    const {inputs, handleChange} = useForm({
      email: '',
      name: '',
      password: ''
    })

  const [signup, { loading }] = useMutation(SIGN_UP);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await signup({
        variables:  {
          userInput: inputs,
      },    
      refetchQueries: [{query: GET_ALL_USERS}]
      });
      localStorage.setItem('token', response.data.signup.token);
      await refetch();
      history.push('/');
    } catch (error) {
      setError(error.graphQLErrors[0].message);
    }
  };


  return (
    <>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
              <Form.Label>E-Mail</Form.Label>
                <Form.Control name="email" type="text" value={inputs.email} placeholder="email" onChange={handleChange} />
              </Form.Group>
              <Form.Group>
              <Form.Label>Name</Form.Label>
                <Form.Control name="name" type="text" value={inputs.name} placeholder="name" onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={inputs.password} placeholder="Пароль" onChange={handleChange}/>
              </Form.Group>
              <Button variant="primary" type="submit">
                Sign Up
              </Button>
            </Form>
        
    </>
  );
};

SignUp.propTypes = {
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default withRouter(SignUp);