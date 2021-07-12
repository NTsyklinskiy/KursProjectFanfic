import { useQuery } from '@apollo/client';
import React, {useState} from 'react'
import { GET_ARTWORK } from '../../utils/graphql';
import { withRouter, Route, Switch, Link } from 'react-router-dom';
import { Button, Grid, Box,CircularProgress, Typography } from '@material-ui/core';
import useStyles from '../Styles/useStyles';
import Chapter from '../Chapter/Chapter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const Artwork = ({location, history, user, handleOpen}) => {
    const [chapterClick, setChapterClick] = useState(false);
    
    const classes= useStyles();
    const [libraryChapter, setLibraryChapter] = useState(false)
    const artworkId = location.pathname.split('/')[2]
    const {data,error, loading} = useQuery(GET_ARTWORK, {
        variables: {id: artworkId}
    });
    
    const artwork = data?.getArtwork ? data?.getArtwork : null;



    const handlerText = () => {
        setChapterClick(true)
    }
    
    return (
        <Box className={classes.artwork}>
            {loading && <CircularProgress style={{position: 'absolute', top: '50%', left: '50%'}}  color="primary" />}
            {artwork && (
                <>
              <Box className={`${classes.chapter} ${libraryChapter && classes.active}`}>
                    <Button
                        style={{padding: '10px'}}
                        onClick={()=> {
                        history.push(`/artwork/${artworkId}`)
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
                                to={`/artwork/${artworkId}/chapter/${chapter.id}`}
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
                    { 
                    (user?.id === artwork?.author?.id || user.role === 'admin') && 
                    <Button
                        component={Link}
                        to={`/update/${artworkId}`}
                    >
                        <FontAwesomeIcon icon={faCog} size='2x'/>
                    </Button>
                    }
                    <Button onClick={()=> {
                        setLibraryChapter(!libraryChapter)
                    }}>
                        Chapters
                    </Button>
                    <Button
                        onClick={handleOpen}

                        style={{
                            position: 'absolute',
                            right: 0,
                        }}
                    >
                        X
                    </Button>
                </Box>
                <Box className={`${classes.text} ${libraryChapter && classes.libraryActive}`}>
                {
                   !chapterClick && (
                    <Grid container justify="center" direction="column">
                        <Typography align='justify' >
                            <span>Author: </span>
                            {artwork?.author?.name || 'DELETE USER'}
                        </Typography>
                        <Typography component='span' align='justify' style={{display: 'flex'}} >
                            <span>Tags: </span>
                            {artwork?.tags.map((tag, i) => {
                                return <p key={i}> #{tag } </p>
                            })}
                        </Typography>   
                        <Typography variant='h3'  align="center">
                            {artwork.name}
                        </Typography>
                        <Typography component='span' align='justify' >
                            <span>Description: </span>
                            {artwork.discription}
                        </Typography>
                        <Typography align='justify' >
                            <span>Chpters: </span>
                            {artwork.chapters.length}
                        </Typography>
                        <Typography align='justify' >
                            <span>Rating Average: </span>
                            {artwork.ratingsAverage}
                        </Typography>
                        
                    </Grid>
                        )
                }
                    <Switch>
                        <Route exect path={['/artwork/:id/chapter/:id']} >
                            <Chapter chapterClick={chapterClick} user={user}/>
                        </Route>
                    </Switch>
                </Box>
                </>
            )}
        </Box>
    );
}

export default withRouter(Artwork)