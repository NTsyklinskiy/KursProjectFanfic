import { useMutation } from '@apollo/client'
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, IconButton, Typography } from '@material-ui/core'
import React from 'react'
import { CREATE_LIKE, DELETE_LIKE, GET_CHAPTER } from '../../utils/graphql'

export const Likes = ({chapter, user}) => {
    const [CreateLike, {loading: loadingCreate}] = useMutation(CREATE_LIKE)
    const [DeleteLike, {loading: loadingDelete}] = useMutation(DELETE_LIKE)
    const like = chapter?.likes?.find(like => like.user?.id === user.id)
    const likesId = chapter?.likes?.filter(like => like.user?.id === user.id)
    console.log(likesId,like);
    return (
        <Box 
            style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
            }}
                // className={classes.button}
        >
        {!like ? 
            (<IconButton
                color="inherit"
                aria-label="library books"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                disabled={loadingCreate}
                onClick={async()=>{
                    await CreateLike({
                        variables:{
                            input: {
                                userId: user.id,
                                chapterId: chapter.id
                            }
                        },
                        update(cache, {data: {createLike}}){
                            const {getChapter: {likes}} = cache.readQuery({
                                query: GET_CHAPTER,
                                variables: {
                                    id: chapter.id
                                }
                            })

                            cache.writeQuery({
                                query: GET_CHAPTER,
                                variables: {
                                  id: chapter.id
                                },
                                data: {
                                  getChapter: {
                                      likes: [...likes, createLike ]}
                                }
                            })
                        }
                    })
                }}
            >
                <FontAwesomeIcon icon={faThumbsUp} />          
            </IconButton>)
                : 
            (<IconButton
                color="inherit"
                aria-label="library books"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                disabled={loadingDelete}
                onClick={async()=>{
                    await DeleteLike({
                        variables:{
                            likeId: like.id    
                        },
                        update(cache,{data:{deleteLike}}){
                            cache.evict(cache.identify(deleteLike));
                        }
                    })
                }}
            >
                <FontAwesomeIcon icon={faThumbsDown} />          
            </IconButton>)
        }
            <Typography style={{fontSize: '1.5rem', paddingTop: '12px'}}
            >
                {chapter.likes.length}
                </Typography>
        </Box>
    )
}
