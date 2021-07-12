import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {  Route, Switch } from 'react-router-dom';
import { Toolbars } from '../components/Toolbar/Toolbar'
import Artworks from '../components/Artwork/Artworks';
import Confirm from './Auth/Confirm';
import { GET_ALL_ARTWORKS} from '../utils/graphql';
import { useQuery } from '@apollo/client';

const AuthLayout = ({ refetch }) => {
  const [open, setOpen] = useState(false)

  const [searchQuery,setSearchQuery] = useState('');

  const ArtworksPayload = useQuery(GET_ALL_ARTWORKS, {
    variables: {
      searchQuery: searchQuery
    }
  });
  return (
    <>
        <Toolbars open={open} setOpen={setOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
        <Switch>
          <Route exact path={['/signin','/signup','/artwork/:id', '/', '/artwork/:id/chapter/:id' ]} render={() => <Artworks ArtworksPayload={ArtworksPayload} refetch={refetch} setOpen={setOpen} open={open}/>} />
          <Route exact path={['/confirm/:token' ]} render={() => <Confirm refetch={refetch} setOpen={setOpen} open={open}/>} />
        </Switch>
    </>
  );
};

AuthLayout.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AuthLayout;