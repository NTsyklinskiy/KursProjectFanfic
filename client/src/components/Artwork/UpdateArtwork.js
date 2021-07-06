import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react'
import {  GET_ARTWORK } from '../../utils/graphql';
import { withRouter, Route, Switch, Link } from 'react-router-dom';
import { Button, Grid, Box, CircularProgress } from '@material-ui/core'
import useStyles from '../Styles/useStyles';
import Chapter from '../Chapter/Chapter';
import { ArtworkPublishBtn } from './ArtworkPublishBtn';




const UpdateArtwork = ({location,history,user,handleOpen}) => {
    const [chapterClick, setChapterClick] = useState(false)
    const classes= useStyles();
    const [libraryChapter, setLibraryChapter] = useState(false)

    const artworkId = location.pathname.split('/')[2];

    const {data,error, loading} = useQuery(GET_ARTWORK, {
        variables: {id: artworkId}
    });
    const artwork = data?.getArtwork ? data?.getArtwork : null;

    const handlerText = () => {
        setChapterClick(true)
    }

    if(user) {
        console.log(user);
    }

    return (
        <>
            <Box className={classes.artwork}
                >
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
                    {artwork.chapters.map((chapter, i)=> {
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
                        onClick={handleOpen}
                    >
                        X
                    </Button>
                   <ArtworkPublishBtn handleOpen={handleOpen} isPublic={artwork.isPublic} artworkId={artworkId}/>
                </Box>
                <Box className={`${classes.text} ${libraryChapter && classes.libraryActive}`}>
                {
                   !chapterClick && (
                            < >
                                Discription
                                {artwork.name}
                                {artwork.discription}
                            </>
                        )
                }
                    <Switch>
                        <Route path={['/update/:id/chapter/:id']} >
                            <Chapter chapterClick={chapterClick}/>
                                
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