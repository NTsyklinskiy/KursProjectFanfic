import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { GET_CHAPTER, UPDATE_CHAPTER } from '../../utils/graphql';
import { CircularProgress,Button, FormControl, Box, FormHelperText,  Input, InputLabel, TextField } from '@material-ui/core';
import useForm from '../../hooks/useForm';
import useStyles from '../Styles/useStyles';
import { DeleteChapterBtn } from './DeleteChapterBtn';


const UpdateChapter = ({location, history, chapterClick, setChapterClick}) => {
    const classes = useStyles();
    const chapterId = location.pathname.split('/')[4];
    const {data,error, loading} = useQuery(GET_CHAPTER, {
        variables: {
            id: chapterId
        }
    });

    const [chapter, setChapter] = useState(null)

    useEffect(()=>{
      setChapter(data?.getChapter)
    }, [data,loading])

    const [UpdatedChapter, {data:dataUpdate,error:errorUpdate,loading: loadingUpdate}] = useMutation(UPDATE_CHAPTER)


    const {inputs,handleChange} = useForm({
        title: chapter?.title,
        text: chapter?.text,
    });

    const handlerUpdateChapter = async(e) => {
        e.preventDefault()
        const {title, text} = inputs;
        await UpdatedChapter({
          variables: {
            input: {
              title,
              text,
              chapterId 
            }
          },
          update(cache, {data: {updateChapter}}){
            cache.writeQuery({
              query: GET_CHAPTER,
              variables: {
                id: chapterId
              },
              data: {
                getChapter: {
                  ...updateChapter
                }
              }
            })
          }
        })
    }
    
    
    return (
        <>
            {loading && <CircularProgress style={{position: 'absolute', top: '50%', left: '50%'}}  color="primary" />}
            {chapterClick && (
                chapterId && chapter && (
             <Box style={{position: 'relative', height:"100%"}}>
                 
                    <form  
                      style={{
                        height: '100%',
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column'
                      }}
                      onSubmit={handlerUpdateChapter}
                      >
                        <div style={{display:'flex', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 100}}>
                            <Button 
                              style={{ color: 'green' }}
                              type="submit"
                            >
                              UpDate
                            </Button>
                            <DeleteChapterBtn chapterId={chapterId} imagePublicId={chapter?.imagePublicId} history={history} chapterClick={chapterClick} setChapterClick={setChapterClick} />
                              
                        </div>
                      <Box style={{width: '100%'}}>
                        <TextField
                            style={{width: '100%'}}
                            id="filled-multiline-static"
                            name="title"
                            label="Title"
                            value={inputs.title || ''}
                            onChange={handleChange}
                        />
                        </Box>
                        <FormControl 
                            style={{height: '80%'}}
                        >
                          <InputLabel htmlFor="component-helper">Text</InputLabel>
                          <Input
                            className={classes.textarea}
                            style={{height: '100%'}}
                            id="component-helper"
                            name="text"
                            multiline
                            required
                            rows={15}
                            value={inputs.text || ''}
                            onChange={handleChange}
                            aria-describedby="helper-text"
                            />
                          <FormHelperText id="helper-text">A your chapter text</FormHelperText>
                        </FormControl>
                    </form>
                    </Box>
                )
            )}
     </>   
    )
}

export default withRouter(UpdateChapter);