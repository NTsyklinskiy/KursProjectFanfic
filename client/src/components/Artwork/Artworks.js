import { Button, Card, CardActions, CardContent, CircularProgress, Modal, Fade, Grid, Typography} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link, withRouter, Route, Switch } from 'react-router-dom';
import SignIn from '../../pages/Auth/SignIn';
import SignUp from '../../pages/Auth/SignUp';
import { GET_PUBLISH_ARTWORK} from '../../utils/graphql';
import TransitionsModal from '../Modal/Modal';
import useStyles from '../Styles/useStyles';
import Artwork  from './Artwork';
import { Rating } from '../Rating/Rating';

const Artworks = ({ArtworksPayload,history,user, refetch, open, setOpen}) => {
  const classes = useStyles();
  const {subscribeToMore: subscribeArtworks ,data: dataArtworks,error: errorArtworks,loading: loadingArtworks} = ArtworksPayload;  
  const [data, setData] = useState([])

  useEffect(() => {
    setData(dataArtworks?.getArtworks)
  }, [dataArtworks])
 
  const handleOpen = () => {
    setOpen(!open)
  }
  
  useEffect(()=> {
    const unsubscribe = subscribeArtworks({
      document: GET_PUBLISH_ARTWORK,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const {operation, artworks} = subscriptionData.data.publishArtworks;
        if(operation === 'PUBLISH_AND_NO_ARTWORK'){
          const [artwork] = artworks;
          
          if(prev.getArtworks.find(arg => arg.id === artwork.id)){
            const mergedArtworks = prev.getArtworks.filter(art => art.id !== artwork.id);
            return { getArtworks: mergedArtworks };
          }
          const mergedArtworks = [...prev.getArtworks, artwork];
  
          return { getArtworks: mergedArtworks };

        }
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeArtworks])

    return ( 
      <>
          <Switch>
            <TransitionsModal history={history} open={open} setOpen={setOpen}>
              {!user &&
                <>
                <Route exact path='/signin' render={() => <SignIn refetch={refetch} />} />
                <Route exact path='/signup' render={() => <SignUp refetch={refetch} />} />
                </>
              }
              <Route exact path={['/artwork/:id/chapter/:id','/artwork/:id']} render={() => <Artwork user={user} handleOpen={handleOpen} />} />
            </TransitionsModal>
          </Switch>
            
          <Grid item style={{overflow: 'hidden'}} xs={12}>
            <Grid style={{margin: 0}} container spacing={4}  alignItems='center' justify='center'>
          {loadingArtworks && <CircularProgress style={{position: 'absolute', top: '50%', left: '50%'}} color="primary" />}
          { data && data.map((artwork)=> {
            return(
                <Grid 
                  item 
                  key={artwork.id} 
                  >
                  <Card className={classes.rootArtwork}>
                    <CardContent>
                      <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', height: '60px'}}>
                        <Typography className={classes.titleArtwork} color="textSecondary" gutterBottom>
                          Author {artwork?.author?.name}
                        </Typography>
                        <Typography 
                          className={classes.posArtwork} 
                          style={{position:'relative', width: '60%', display: 'flex',justifyContent:'flex-end'}} 
                          color="textSecondary"
                          component='span'
                        >                        
                          <Rating artworks={dataArtworks} artwork={artwork} user={user} subscribeToMore={subscribeArtworks}/>
                        </Typography>
                      </div>
                      <Typography variant="h5" component="h2">
                        {artwork.name}
                      </Typography>
    
                      <Typography style={{whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis'}} variant="body2" component="p">
                        {artwork.fandom}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small"
                        component={Link}
                        to={`/artwork/${artwork.id}`}
                        onClick={
                          handleOpen
                        }
                      >To learn more</Button>
                    </CardActions>
                  </Card>
                </Grid>
            )
            })
          }
          
          </Grid>
        </Grid>
      </>
    )
  }
  
  export default withRouter(Artworks)