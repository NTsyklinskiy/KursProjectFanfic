import React from 'react';
import { useQuery } from '@apollo/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css'
import { GET_AUTH_USER } from './utils/graphql';

import AuthLayout from './pages/AuthLayout';
import AppLayout  from './pages/AppLayout';
import { CircularProgress, Modal } from '@material-ui/core';

const App = () => {

  const { data, loading, error, refetch } = useQuery(GET_AUTH_USER);

  return (
    <>
    {
      loading && <CircularProgress style={{position: 'absolute', top: '50%', left: '50%'}}/>
    }
    
        <Router>
          <Switch>
            {data?.getAuthUser ? (
              <Route exact render={() => <AppLayout authUser={data.getAuthUser} errorAuthUser={error}  refetch={refetch} />} />
            ) : (
              <Route exact render={() => <AuthLayout refetch={refetch} />} />
            )}
          </Switch>
      </Router>

        </>
  );
};

export default App;