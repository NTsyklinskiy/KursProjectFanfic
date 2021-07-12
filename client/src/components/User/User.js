import { Button, Grid, Box, TextField, Chip } from '@material-ui/core'
import React, { useState } from 'react'
import { withRouter, Link, Switch, Route } from 'react-router-dom'
import AddArtwork from '../Artwork/AddArtwork';
import UpdateArtwork from '../Artwork/UpdateArtwork';
import TransitionsModal from '../Modal/Modal'
import AddChapter from '../Chapter/AddChapter'
import useStyles from '../Styles/useStyles';
import { Autocomplete } from '@material-ui/lab';
import { AdminPanel } from './AdminPanel';
import { UPDATE_PREFERENCE } from '../../utils/graphql';
import { useMutation } from '@apollo/client';


const User = ({history, location, user, open, setOpen}) => {
  const classes = useStyles()
  const [preference, setPreference] = useState(user?.preference || [])
  const preferences = ['Fanfic 1', 'Fanfic 2', 'Fanfic 3'];
  const [usersId, setUsersId] = useState([])
  
  const [UpdatePreference, {data, error, loading}] = useMutation(UPDATE_PREFERENCE)

  const handleOpen = () => {
    setOpen(!open)
  }

    return (
        <>
          <Switch>
            <TransitionsModal history={history} pathname={'user'} open={open} setOpen={setOpen}>
              <Route exact path={'/user/artwork-add'} render={() => <AddArtwork user={user} usersId={usersId}  handleOpen={handleOpen}/>} />
              <Route exact path={'/user/update/:id/chapter-add'} render={() => <AddChapter user={user} />} />
              <Route exact path={['/update/:id', '/update/:id/chapter/:id']} render={() => <UpdateArtwork user={user} handleOpen={handleOpen}/>} />
            </TransitionsModal>
          </Switch>
          <Grid 
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid  item  style={{paddingTop: '20px',width: '50%', display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
            <Button
                component={Link} 
                variant="contained"
                className={classes.button}
                color="primary" 
                to={`/user/artwork-add`} 
                onClick={handleOpen}
            >
                Add Artwork
            </Button>
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
            <Grid item style={{width: '50%'}}>
            <form 
              style={{width: '80%',display: 'flex', alignItems: 'center', justifyContent:'center', flexDirection: 'column'}}
              onSubmit={async(e)=> {
                try{
                  e.preventDefault()
                  await UpdatePreference({
                    variables: {
                      preference
                    },
                    update(cache, {data: {updatePreference}}){
                      console.log(cache,updatePreference);
                    }
                  })
                }catch(error){
                  console.error(error);
                }
                }}
                >
                  <h3>Your Preferences</h3>
                <Autocomplete
                  fullWidth
                  multiple
                  id="preferences-filled"
                  options={preferences.map((option) => option)}
                  value={preference}
                  onChange={(event, newValue) => {
                      setPreference([
                        ...newValue
                  ]);
                  }}
                  onKeyDown={e => {
                      if(e.key === 'Enter'){
                          e.preventDefault()
                      }
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) =>{ 
                          return(
                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                            )
                        })
                    }
                  renderInput={(params) => (
                    <TextField  {...params} value={preference} label="Preferences"  placeholder="Preferences" />
                  )}
                  />
                    <Button type="submit">
                        Update
                    </Button>
                </form>
            </Grid>
          </Grid>
          { user.role === 'admin' && 
          <Grid style={{overflow: 'auto'}}>
            <AdminPanel user={user} setUsersId={setUsersId}/>
          </Grid>
          }
          
          
        </>
    )
}

export default withRouter(User)
