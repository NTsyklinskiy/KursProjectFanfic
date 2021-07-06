import { useMutation } from '@apollo/client';
import { Button } from '@material-ui/core';
import React from 'react'
import {Link} from 'react-router-dom'
import { ARTWORK_PUBLISH,GET_ALL_ARTWORKS,GET_ARTWORK } from '../../utils/graphql';

export const ArtworkPublishBtn = ({handleOpen,artworkId, isPublic}) => {
    const [PublishArtwork] = useMutation(ARTWORK_PUBLISH)
    return (
        !isPublic ? 
            <Button
                component={Link}
                type='submit'
                color='primary'
                to={'/'}
                onClick={async() => {
                    handleOpen()
                    await PublishArtwork({
                        variables: {
                            artworkId
                        },
                        update(cache, _){
                         
                              cache.writeQuery({
                                query: GET_ARTWORK,
                                variables: {
                                  id: artworkId
                                },
                                data: {
                                  getArtwork: {
                                    isPublic: true
                                  }
                                }
                              })
                        },
                    })
            }}>
                Publish
            </Button>
        :   <Button
                component={Link}
                type='submit'
                color='secondary'
                to={'/'}
                onClick={async() => {
                    handleOpen()
                    await PublishArtwork({
                        variables: {
                            artworkId
                        },
                        update(cache, _){
                              cache.writeQuery({
                                query: GET_ARTWORK,
                                variables: {
                                  id: artworkId
                                },
                                data: {
                                  getArtwork: {
                                    isPublic: false
                                  }
                                }
                              })


                        },
                    })
            }}>
                No Publish
            </Button>
    )
}
