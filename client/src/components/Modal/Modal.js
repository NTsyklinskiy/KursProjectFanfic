import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import useStyles from '../Styles/useStyles';

const TransitionsModal = ({history,pathname,open,setOpen,children}) => {
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
    setTimeout(()=>{ 
      history.goBack()
    }, 300)
  };


  return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
            <div className={classes.paper}>
                {children}
            </div>
        </Fade>
      </Modal>
  );
}

export default TransitionsModal;