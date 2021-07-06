import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, MenuItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import SignOut from '../../pages/Auth/SignOut';
import SimpleMenu from './Menu';
import useStyles from '../Styles/useStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookReader, faSearch, faSignInAlt, faUserCircle} from '@fortawesome/free-solid-svg-icons';


  export const Toolbars = ({open, setOpen, user = null}) => {
  const classes = useStyles();

  const [searchQuery,setSearchQuery] = useState('')
    

  
  const [anchorEl, setAnchorEl] = useState(false);

  const handleOpen = (e) => {
    setOpen(!open)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

      return (
          <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                  <IconButton
                    component={Link}
                    to={'/'}
                    className={classes.button}
                    edge="start"
                    color="inherit"
                    aria-label="library books"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                  >
                    <FontAwesomeIcon icon={faBookReader} />          
                  </IconButton>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <FontAwesomeIcon icon={faSearch} />          
                    </div>
                    <InputBase
                      placeholder="Search…"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      value={searchQuery}
                      inputProps={{ 'aria-label': 'search' }}
                      onChange={
                        (e) => setSearchQuery(e.target.value)
                      }
                      onKeyDown={
                        async (e) => {
                         if(e.key === 'Enter'){
                           if(searchQuery){
                            //  await SearchData({
                              //  variables: {
                                //  searchQuery
                              //  }
                            //  })
                             setSearchQuery('')
                           }
                         }
                        }
                      }
                    />
                  </div>
                {user ? (
                    <SimpleMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} icon={faUserCircle}>
                      <MenuItem component={Link} to={'/user'} onClick={handleClose}>My Profile</MenuItem>
                      <SignOut />
                    </SimpleMenu>
                    ) : (
                    <SimpleMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} icon={faSignInAlt}>
                      <MenuItem component={Link} to={'/signin'} onClick={handleOpen}>Sign In</MenuItem>
                      <MenuItem component={Link} to={'/signup'} onClick={handleOpen}>Sign Up</MenuItem>
                    </SimpleMenu>
                )}
            </Toolbar>
          </AppBar>
      )
  }
  