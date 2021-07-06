import React from 'react';
import { useQuery } from '@apollo/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css'
import { GET_ALL_ARTWORKS, GET_AUTH_USER } from './utils/graphql';

import AuthLayout from './pages/AuthLayout';
import AppLayout  from './pages/AppLayout';

const App = () => {

  const { loading, data, error, refetch } = useQuery(GET_AUTH_USER);
  const ArtworksPayload = useQuery(GET_ALL_ARTWORKS);

  if (loading) return (<div>Loading...</div>);
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Router>
        <Switch>
          {data.getAuthUser ? (
            <Route exact render={() => <AppLayout authUser={data.getAuthUser} refetch={refetch} ArtworksPayload={ArtworksPayload}/>} />
          ) : (
            <Route exact render={() => <AuthLayout refetch={refetch} ArtworksPayload={ArtworksPayload}/>} />
          )}
        </Switch>
    </Router>
  );
};

export default App;