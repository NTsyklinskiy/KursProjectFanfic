import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import {  GET_ARTWORK, GET_TAGS, UPDATE_ARTWORK } from '../../utils/graphql';
import { withRouter, Route, Switch, Link } from 'react-router-dom';
import { Button, Box, CircularProgress, Input, Select,FormHelperText,InputLabel, FormControl, Chip, TextField, ButtonGroup } from '@material-ui/core'
import useStyles from '../Styles/useStyles';
import UpdateChapter from '../Chapter/UpdateChapter';
import { ArtworkPublishBtn } from './ArtworkPublishBtn';
import { Autocomplete } from '@material-ui/lab';
import useForm from '../../hooks/useForm';
import { DeleteArtworkBtn } from './DeleteArtworkBtn';




const UpdateArtwork = ({location,history,user,handleOpen}) => {
    const classes= useStyles();
    const artworkId = location.pathname.split('/')[2];
    const [chapterClick, setChapterClick] = useState(false)
    const [libraryChapter, setLibraryChapter] = useState(false)

    const {data: dataArtwork,error, loading} = useQuery(GET_ARTWORK, {
        variables: {id: artworkId}
    });
    // const artwork = dataArtwork?.getArtwork ? dataArtwork?.getArtwork : null;
    const [tags, setTags] = useState([])
    const [artwork, setArtwork] = useState(null)

    useEffect(()=>{
      setArtwork(dataArtwork?.getArtwork)
      setTags(dataArtwork?.getArtwork.tags)
    }, [dataArtwork])
    const [UpdateArtwork, {data:dataUpdate, error: errorUpdate, loading: loadingUpdate}] = useMutation(UPDATE_ARTWORK)



    const {inputs,handleChange} = useForm({
        name: artwork?.name,
        discription: artwork?.discription,
        fandom: artwork?.fandom,
    })

    const {data: dataTags, loading: loadingTags} = useQuery(GET_TAGS)
    

    const handlerUpdateArtwork = async(e) => {
        e.preventDefault()
        const {name, discription, fandom} = inputs;
        await UpdateArtwork({
          variables: {
            inputUpdate: {
              name,
              discription,
              fandom,
              tags,
              artworkId 
            }
          },
          update(cache, {data: {updateArtwork}}){
            cache.writeQuery({
              query: GET_ARTWORK,
              variables: {
                id: artworkId
              },
              data: {
                getArtwork: {
                  ...updateArtwork
                }
              }
            })
          }

        })        

    }
    
    const handlerText = () => {
        setChapterClick(true)
    }

  
    return (
        <>
            <Box className={classes.artwork}>
                {loading && <CircularProgress color="primary" />} 
                {artwork && (
                <>
             <Box className={`${classes.chapter} ${libraryChapter && classes.active}`}>
                    <Button
                        onClick={()=> {
                        history.push(`/update/${artworkId}`)
                        setChapterClick(false)
                    }}
                    >
                        Description
                    </Button>
                    {!artwork?.chapters.length ? <span>No Chapters</span> : artwork?.chapters.map((chapter, i)=> {
                        return (
                            <Link
                                key={chapter.id}
                                onClick={handlerText}
                                to={`/update/${artworkId}/chapter/${chapter.id}`}
                                className={`${classes.libraryChapter}`}
                            >
                              <img src={chapter.image} alt="" />
                              <div className={classes.descriptionChapterButton}>
                               {chapter.title}
                              </div>
                            </Link>
                        )
                    })}
                </Box>
                <Box className={`${classes.header} ${libraryChapter && classes.libraryActive}`}>
                    <Button
                        component={Link}
                        to={`/user/update/${artworkId}/chapter-add`}
                    >
                        Add Chapter
                    </Button>
                    <Button onClick={()=> {
                        setLibraryChapter(!libraryChapter)
                    }}>
                        Library
                    </Button>
                    <Button
                    style={{
                        position: 'absolute',
                        right: 0,
                    }}
                        onClick={handleOpen}
                    >
                        X
                    </Button>
                   <ArtworkPublishBtn handleOpen={handleOpen} artwork={artwork}/>
                </Box>
                <Box className={`${classes.text} ${libraryChapter && classes.libraryActive}`}>
                {
                    // ------------------------------
                   !chapterClick && (
                    <Box style={{position: 'relative', height:"100%"}}>
                 
                    <form  
                      style={{
                        height: '100%',
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column'
                      }}
                      onSubmit={handlerUpdateArtwork}
                      >
                        <div style={{display:'flex', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex:100, backgroundColor: 'white'}}>
                            <Button 
                              style={{ color: 'green' }}
                              type="submit"
                            >
                              UpDate
                            </Button>
                            <DeleteArtworkBtn artworkId={artworkId} handleOpen={handleOpen} history={history}/>
                              
                        </div>
                      <Box style={{width: '100%'}}>
                        <TextField
                            style={{width: '50%'}}
                            id="filled-multiline-static"
                            name="name"
                            label="Name"
                            value={inputs.name || ''}
                            onChange={handleChange}
                        />
                        <FormControl style={{width: '50%'}}>
                          <InputLabel htmlFor="fandom-native">Fandom</InputLabel>
                          <Select
                            native
                            required
                            value={inputs.fandom || ''}
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
                       <Box style={{width: '100%'}}>
                       
                       <Autocomplete
                        multiple
                        id="tags-filled"
                        options={[...new Set(dataTags?.getTags.tags)].map((option) => option)}
                        freeSolo
                        required
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
                          <TextField  {...params}  label="Tags"  placeholder="Tags" />
                        )}
                      />
                        </Box>
                        <FormControl 
                            style={{height: '100%'}}
                        >
                          <InputLabel htmlFor="component-helper">Description</InputLabel>
                          <Input
                            className={classes.textarea}
                            style={{height: '100%'}}
                            id="component-helper"
                            name="discription"
                            multiline
                            required
                            rows={10}
                            value={inputs.discription || ''}
                            onChange={handleChange}
                            aria-describedby="helper-text"
                            />
                          <FormHelperText id="helper-text">A short description of your fanfic</FormHelperText>
                        </FormControl>
                    </form>
                    </Box>
                        )
                    // ------------------------
                    }
                    <Switch>
                        <Route path={['/update/:id/chapter/:id']} >
                            <UpdateChapter chapterClick={chapterClick} setChapterClick={setChapterClick}/>
                                
                        </Route>
                    </Switch>
                </Box>
            </>
                )}
            </Box>
        </>
    )
}

export default withRouter(UpdateArtwork)