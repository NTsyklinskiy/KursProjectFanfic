import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Backdrop, Button, Modal, Fade, Grid, Typography, Box, Chip, TextField} from '@material-ui/core';
import useStyles from '../Styles/useStyles';
import { Autocomplete } from '@material-ui/lab';
import { useMutation } from '@apollo/client';
import { FIRST_LOGIN, GET_ALL_ARTWORKS } from '../../utils/graphql';

const FirstSettings = ({history, location, refetch, user}) => {
  const classes = useStyles();
  const [preference, setPreference] = useState([])
  const preferences = {getPreferences: {preferences: ['Fanfic 1', 'Fanfic 2', 'Fanfic 3'] }}
  const dataPreferences = preferences?.getPreferences ? [...new Set(preferences?.getPreferences.preferences)] : [];

  const [FirstLogin,{data, error,loading}] = useMutation(FIRST_LOGIN)
    return (
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={!data?.firstLogin?.message}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={!data?.firstLogin?.message}>
            <div className={classes.paper}>
               {data?.firstLogin?.message ? <h2>{data?.firstLogin?.message}</h2> : ( <form 
                    style={{display: 'flex', alignItems: 'center', justifyContent:'center', flexDirection: 'column'}}
                    onSubmit={async(e)=> {
                        try{
                            e.preventDefault()
                            await FirstLogin({
                                variables: {
                                    preference
                                },
                                refetchQueries: [{query: GET_ALL_ARTWORKS}]
                            })
                            await refetch()

                        }catch(error){
                            console.error(error);
                        }
                    }}
                >
                    <h2>Welcom {user.name}</h2>
                    <p>Please select your preference before proceeding.</p>
                     <Autocomplete
                        fullWidth
                        multiple
                        id="preferences-filled"
                        options={dataPreferences.map((option) => option)}
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
                    <Button type="submit" onClick={()=> {
                        history.push('/')
                    }}>
                        Proceed
                    </Button>
                </form>)}
            </div>
        </Fade>
      </Modal>
    )
}


export default withRouter(FirstSettings)