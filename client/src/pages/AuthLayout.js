import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {  Route, Switch } from 'react-router-dom';
import { Toolbars } from '../components/Toolbar/Toolbar'
import Artworks from '../components/Artwork/Artworks';

const AuthLayout = ({ refetch , ArtworksPayload}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
        <Toolbars open={open} setOpen={setOpen}/>
        <Switch>
          <Route exact path={['/signin','/signup','/artwork/:id', '/', '/artwork/:id/chapter/:id' ]} render={() => <Artworks ArtworksPayload={ArtworksPayload} refetch={refetch} setOpen={setOpen} open={open}/>} />
        </Switch>
    </>
  );
};

AuthLayout.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AuthLayout;