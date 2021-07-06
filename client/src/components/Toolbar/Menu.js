import React from 'react';
import {Menu, IconButton} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SimpleMenu({anchorEl, setAnchorEl, children, icon}) {
//   const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <FontAwesomeIcon icon={icon} />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {
            children
        }
      </Menu>
    </div>
  );
}