import React, { useState } from 'react'
import {DropzoneDialog} from 'material-ui-dropzone'
import Button from '@material-ui/core/Button';
 
const DropzoneDialogExample = ({image, setImage}) => {
    const [state, setState] = useState({
        open: false,
    })

    const handleClose =() => {
        setState({
            open: false
        })
    }
    const handleSave =(files) => {
        setImage(files[0]);
        setState({
            open: false
        })
    }
 
    const handleOpen =() =>{
        setState({
            open: true,
        })
    }
 
    
        return (
            <div>
                <Button onClick={handleOpen}>
                  Upload Image
                </Button>
                <DropzoneDialog
                    maxWidth='xs'
                    open={state.open}
                    onSave={handleSave}
                    acceptedFiles={['image/jpeg', 'image/jpg', 'image/png']}
                    showPreviews={true}
                    maxFileSize={5000000}
                    onClose={handleClose}
                />
            </div>
        );
    
}
export default DropzoneDialogExample;