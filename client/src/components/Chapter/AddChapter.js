
import { useMutation } from '@apollo/client';
import { Button ,FormControl,Container, FormHelperText, Box, Input, InputLabel, TextField,  Select } from '@material-ui/core'
import React, { useState } from 'react'
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import { withRouter } from 'react-router';
import useForm from '../../hooks/useForm';
import { CREATE_CHAPTER, GET_ARTWORK } from '../../utils/graphql';
import ChapterImageDrop from './ChapterImageDrop';

const AddChapter = ({location,history,user}) => {
    const [CreateChapter,{loading}] = useMutation(CREATE_CHAPTER)
    const {inputs,handleChange} = useForm({
        title: '',
        text: '',
    });
    const [image, setImage] = useState(null);

    const artworkId = location.pathname.split('/')[3];

    const {title, text} = inputs;

    const handlerBack = (e) => {
        history.goBack()
    }

    
    const handlerCreateChapter = async(e) => {
        try{
            e.preventDefault();
            await CreateChapter({variables:  {
                input: {
                    title,
                    text,
                    artworkId 
                },
                file: image,
              },
              update(cache, {data: {createChapter}}){
                const {getArtwork: {chapters}} = cache.readQuery({
                  query: GET_ARTWORK,
                  variables: {
                    id: artworkId
                  }
                })
                
                cache.writeQuery({
                  query: GET_ARTWORK,
                  variables: {
                    id: artworkId
                  },
                  data: {
                    getArtwork: {
                      chapters: [...chapters, createChapter]
                    }
                  }
                })
                
                history.goBack()
              }
            })
        }catch(e) {
            console.error(e);
        }
    };

    return (
        <>      
            <Container width='80vw'>
            <Button
            onClick={handlerBack}>
                Back
            </Button>
            <form onSubmit={handlerCreateChapter}>
                 <Button type="submit">Add</Button>
                 <ChapterImageDrop image={image} setImage={setImage}/>
                 
                <TextField
                    required
                    id="filled-multiline-static"
                    name="title"
                    label="Title"
                    value={inputs.title}
                    onChange={handleChange}
                    />
                <FormControl fullWidth>
                  <InputLabel htmlFor="component-helper">Text</InputLabel>
                  <Input
                    id="component-helper"
                    name="text"
                    multiline
                    required
                    rows={10}
                    value={inputs.text}
                    onChange={handleChange}
                    aria-describedby="helper-text"
                    />
                  <FormHelperText id="helper-text">Your chapter text</FormHelperText>
                </FormControl>
              </form>
            </Container>

            </>
    )
}

export default withRouter(AddChapter)