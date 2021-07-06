import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';
import { useStore } from '../store/store';
import { SET_AUTH_USER } from '../store/auth';
import { Toolbars } from '../components/Toolbar/Toolbar';
import Artworks from '../components/Artwork/Artworks';
import User from '../components/User/User';
// import { useLazyQuery, useQuery } from '@apollo/client';
// import {SEARCH_ARTWORKS, GET_ALL_ARTWORKS} from '../utils/graphql';


const AppLayout = ({ location,  authUser, ArtworksPayload}) => {
  const [{ auth }, dispatch] = useStore();
  const [open, setOpen] = useState(false)

  // const [SearchData, search] = useLazyQuery(SEARCH_ARTWORKS);
  // const home = useQuery(GET_ALL_ARTWORKS);

  useEffect(() => {
    dispatch({ type: SET_AUTH_USER, payload: authUser });
  }, [dispatch, authUser]);


  if (!auth.user) return null;
  return (
    <>
    <Toolbars open={open} setOpen={setOpen} user={auth?.user} />
      <Switch>
        <Route exact path={['/', '/artwork/:id', '/artwork/:id/chapter/:id']} render={() => <Artworks ArtworksPayload={ArtworksPayload} user={auth?.user} open={open} setOpen={setOpen} />} />
        <Route exact path={['/user', '/user/artwork-add', '/user/update/:id/chapter-add',  '/update/:id', '/update/:id/chapter/:id']} render={() => <User user={auth?.user} open={open} setOpen={setOpen} />} />
      </Switch>
    </>
  );
};

AppLayout.propTypes = {
  location: PropTypes.object.isRequired,
  authUser: PropTypes.object.isRequired,
};

export default withRouter(AppLayout);