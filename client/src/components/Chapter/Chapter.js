import { useQuery } from '@apollo/client';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { GET_CHAPTER } from '../../utils/graphql';
import { Grid, Typography } from '@material-ui/core';
import Comments from '../Comment/Comments';
import { Likes } from '../Like/Likes';


const Chapter = ({location, history, user,chapterClick}) => {
    const chapterId = location.pathname.split('/')[4];
    console.log(user);
    const {data,error, loading} = useQuery(GET_CHAPTER, {
        variables: {
            id: chapterId
        }
    });

    if(loading) return <>Loading................</>;

    const chapter = data?.getChapter ? data.getChapter : null;
    console.log(chapter);
    return (
        <>
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