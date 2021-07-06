import { Button, Grid, Box } from '@material-ui/core'
import React from 'react'
import { withRouter, Link, Switch, Route } from 'react-router-dom'
import AddArtwork from '../Artwork/AddArtwork';
import UpdateArtwork from '../Artwork/UpdateArtwork';
import TransitionsModal from '../Modal/Modal'
import AddChapter from '../Chapter/AddChapter'


const User = ({history, location, user, open, setOpen}) => {
    console.log(history, location);
    
  const handleOpen = () => {
    setOpen(!open)
    // setTimeout(()=> history.goBack, 1000)
  }

    return (
        <div>
            <Button
                component={Link} 
                // variant="contained"
                // className={classes.button}
                color="primary" 
                to={`/user/artwork-add`} 
                onClick={handleOpen}
            >
                Add Artwork
            </Button>
            <Grid>
              {user.artworks.map((art, i) => {
                return (
                  <Box key={art.id}>
                    <Button
                      component={Link}
                      to={`/update/${art.id}`}
                      onClick={handleOpen}
                    >
                      {art.name}
                    </Button>
                  </Box>  
                )
              })
                
              }
            </Grid>
            <Switch>
            <TransitionsModal history={history} pathname={'user'} open={open} setOpen={setOpen}>
              <Route exact path={'/user/artwork-add'} render={() => <AddArtwork user={user} handleOpen={handleOpen}/>} />
              <Route exact path={'/user/update/:id/chapter-add'} render={() => <AddChapter user={user} />} />
              <Route exact path={['/update/:id', '/update/:id/chapter/:id']} render={() => <UpdateArtwork user={user} handleOpen={handleOpen}/>} />
            </TransitionsModal>
          </Switch>
          
        </div>
    )
}

export default withRouter(User)
