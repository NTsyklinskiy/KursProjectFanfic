import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { GET_CHAPTER } from '../../utils/graphql';
import { CircularProgress, Grid, Typography } from '@material-ui/core';
import Comments from '../Comment/Comments';
import { Likes } from '../Like/Likes';


const Chapter = ({location, history, user,chapterClick}) => {
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


    return (
        <>
            {loading && <CircularProgress style={{position: 'absolute', top: '50%', left: '50%'}}  color="primary" />}
            {chapterClick && (
                chapterId && chapter && (
                    <>
                    <Grid container justify="center" direction="column">
                        <Typography variant='h3'  align="center">
                            {chapter.title}
                        </Typography>
                        <Typography align='justify' >
                            {chapter.text}
                        </Typography>
                    </Grid>
                    <Likes chapter={chapter} user={user}/>
                    <Comments chapter={chapter} user={user}/>
                    </>
                )
            )}
     </>   
    )
}

export default withRouter(Chapter);