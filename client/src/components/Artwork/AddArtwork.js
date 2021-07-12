import { useMutation, useQuery } from '@apollo/client';
import { Button ,FormControl, FormHelperText, Box, Input, InputLabel, TextField,  Select, Chip } from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab';
import React, { useState } from 'react'
import { withRouter } from 'react-router';
import useForm from '../../hooks/useForm';
import { CREATE_ARTWORK, GET_AUTH_USER, GET_TAGS } from '../../utils/graphql';

const AddArtwork = ({history, user, usersId, handleOpen}) => {
    const [CreateArtwork,{loading}] = useMutation(CREATE_ARTWORK)
    const [tags, setTags] = useState([])
    const {inputs,handleChange} = useForm({
        name: '',
        discription: '',
        fandom: '',
        authorId: user?.id 
    })

    const {data, loading: loadingTags, error} = useQuery(GET_TAGS)


   
    const {name ,discription ,fandom, authorId} = inputs;

    const handlerCreateArtwork = async(e) => {
        try{
            e.preventDefault();
            await CreateArtwork({variables:  {
                input: {
                  name,
                  discription,
                  fandom,
                  tags,
                  authorId
                }
              },
              update(cache, {data: {createArtwork}}){
                const {getAuthUser: { artworks}} = cache.readQuery({
                  query: GET_AUTH_USER
                })
                
                cache.writeQuery({
                  query: GET_AUTH_USER,
                  data: {
                    getAuthUser: {
                      artworks: [...artworks, createArtwork]
                    }
                  }
                })
                history.push(`/update/${createArtwork.id}`)
              }
            })
        }catch(e) {
            console.error(e);
        }
    }

    const dataTags = data?.getTags ? [...new Set(data?.getTags.tags)] : [];
    return (
        <Box style={{position: 'relative'}}>
            <Button
              onClick={handleOpen}
            >
              Back
            </Button>
            <form  
              style={{
                display: 'flex',
                width: '50vw',
                flexDirection: 'column'
              }}
              onSubmit={handlerCreateArtwork}
              >
                <Button 
                  style={{position: 'absolute', top:0, right: 0}}
                  type="submit"
                >
                  Add
                </Button>
              <Box style={{width: '100%'}}>
                <TextField
                    style={{width: '50%'}}
                    id="filled-multiline-static"
                    name="name"
                    label="Name"
                    value={inputs.name}
                    onChange={handleChange}
                />
                <FormControl style={{width: '50%'}}>
                  <InputLabel htmlFor="fandom-native">Fandom</InputLabel>
                  <Select
                    native
                    required
                    value={inputs.fandom}
                    onChange={handleChange}
                    inputProps={{
                      name: 'fandom',
                      id: 'fandom-native',
                    }}
                  >
                    <option aria-label="None" value="" />
                    <option value={'Fanfic 1'}>Fanfic 1</option>
                    <option value={'Fanfic 2'}>Fanfic 2</option>
                    <option value={'Fanfic 3'}>Fanfic 3</option>
                  </Select>
                </FormControl>
                </Box>
                {user.role==='admin' && (
                  <FormControl style={{width: '100%'}}>
                  <InputLabel htmlFor="fandom-native">Users</InputLabel>
                  <Select
                    native
                    required
                    value={inputs.authorId}
                    onChange={handleChange}
                    inputProps={{
                      name: 'authorId',
                      id: 'authorId-native',
                    }}
                  >
                    <option aria-label="None" value="" />
                    {usersId.map((userId) => {
                      return <option key={userId} value={userId}>{userId}</option> 
                    })}
                  </Select>
                </FormControl>
                )}
               <Box style={{width: '100%'}}>
               <Autocomplete
                multiple
                id="tags-filled"
                options={dataTags.map((option) => option)}
                freeSolo
                value={tags}
                onChange={(event, newValue) => {
                  setTags([
                    ...newValue
                  ]);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) =>{ 
                    return(
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  )})
                }
                renderInput={(params) => (
                  <TextField  {...params} value={tags} label="Tags"  placeholder="Tags" />
                )}
              />
                </Box>
                <FormControl>
                  <InputLabel htmlFor="component-helper">Description</InputLabel>
                  <Input
                    id="component-helper"
                    name="discription"
                    multiline
                    required
                    rows={10}
                    value={inputs.discription}
                    onChange={handleChange}
                    aria-describedby="helper-text"
                    />
                  <FormHelperText id="helper-text">A short description of your fanfic</FormHelperText>
                </FormControl>
            </form>
            </Box>
    )
}

export default withRouter(AddArtwork)

