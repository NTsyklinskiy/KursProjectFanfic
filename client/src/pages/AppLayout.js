import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';
import { useStore } from '../store/store';
import { SET_AUTH_USER } from '../store/auth';
import { Toolbars } from '../components/Toolbar/Toolbar';
import Artworks from '../components/Artwork/Artworks';
import User from '../components/User/User';
import { GET_ALL_ARTWORKS} from '../utils/graphql';
import { useQuery } from '@apollo/client';
import FirstSettings from '../components/Settings/FirstSettings';


const AppLayout = ({ location, errorAuthUser, refetch, authUser}) => {
  const [{ auth }, dispatch] = useStore();
  const [open, setOpen] = useState(false)

  const [searchQuery,setSearchQuery] = useState('');

  const ArtworksPayload = useQuery(GET_ALL_ARTWORKS, {
    variables: {
      preference: auth?.user?.preference,
      searchQuery: searchQuery
    }
  });
  
  
  useEffect(() => {
    dispatch({ type: SET_AUTH_USER, payload: authUser });
  }, [dispatch, authUser]);


  if (!auth.user) return null;
  return (
    <>
    <Toolbars open={open} setOpen={setOpen} user={auth?.user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Switch>
        <Route exact path={['/', '/artwork/:id', '/artwork/:id/chapter/:id']} render={() => <Artworks ArtworksPayload={ArtworksPayload} user={auth?.user} open={open} setOpen={setOpen} />} />
        <Route exact path={['/user', '/user/artwork-add', '/user/update/:id/chapter-add',  '/update/:id', '/update/:id/chapter/:id']} render={() => <User user={auth?.user} open={open} setOpen={setOpen} />} />
      </Switch>
      {
        auth?.user?.isFirstLogin &&
        <FirstSettings user={auth?.user} refetch={refetch}/>
      }
    </>
    
  );
};

AppLayout.propTypes = {
  location: PropTypes.object.isRequired,
  authUser: PropTypes.object.isRequired,
};

export default withRouter(AppLayout);