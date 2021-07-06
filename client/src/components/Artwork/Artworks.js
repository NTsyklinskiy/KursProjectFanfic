import { useQuery } from '@apollo/client';
import { Button, Card, CardActions, CardContent, CircularProgress, Grid, Typography} from '@material-ui/core';
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
  // const {data: dataSearch, loading: loadingSearch, error: errorSearch} = search;
  const {subscribeToMore: subscribeHome ,data: dataHome,error: errorHome,loading: loadingHome} = ArtworksPayload;
  
  const [datas, setData] = useState([])

  // const data = ((!dataSearch?.searchArtworks && dataSearch?.searchArtworks ) || dataSearch?.searchArtworks.length) ?  dataSearch?.searchArtworks : dataHome?.getArtworks;


  useEffect(() => {
    setData(dataHome?.getArtworks)
  }, [dataHome])
 
  const handleOpen = () => {
    setOpen(!open)
  }
  
  useEffect(()=> {
    const unsubscribe = subscribeHome({
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
  }, [subscribeHome])

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
                Search panel
              {/* {dataSearch?.searchArtworks &&  <Button onClick={() => {
                setData(dataHome.getArtworks)
              }}>X</Button>} */}
             
          </Grid>
          <Grid item style={{overflow: 'hidden'}} xs={12}>
            <Grid style={{margin: 0}} container spacing={4}  alignItems='center' justify='center'>
              {/* {(loadingHome || loadingSearch) && <CircularProgress style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate()'}}/>} */}
          { datas && datas.map((artwork, i)=> {
            return(
                <Grid 
                  item 
                  key={artwork.id} 
                  // style={{visibility: `${loadingHome || loadingSearch ? 'hidden': 'visible'}`, opacity: `${!loadingHome || !loadingSearch ? 1 : 0}`}}
                  >
                  <Card className={classes.rootArtwork}>
                    <CardContent>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <Typography className={classes.titleArtwork} color="textSecondary" gutterBottom>
                        Author {artwork.author.name}
                      </Typography>
                      <Typography className={classes.posArtwork} style={{position:'relative', width: '60%'}} color="textSecondary">                        
                        <Rating artworks={dataHome} artwork={artwork} user={user} subscribeToMore={subscribeHome}/>
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