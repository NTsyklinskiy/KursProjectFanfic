import { useMutation } from '@apollo/client'
import { Button } from '@material-ui/core'
import React from 'react'
import { DELETE_ARTWORK } from '../../utils/graphql'

export const DeleteArtworkBtn = ({handleOpen,history,artworkId}) => {
    const [DeleteArtwork, {data,error,loading}] = useMutation(DELETE_ARTWORK)

    const handlerDeleteArtwork = async(e) =>{
        e.preventDefault()
        await DeleteArtwork({variables: {
            artworkId 
        },
        update(cache, {data: {deleteArtwork}}){
            history.push(`/user`)
            handleOpen()
            cache.evict(cache.identify(deleteArtwork));
        }
        })
    }
    return (
        <Button
            style={{ backgroundColor: 'red'}}
            onClick={
                handlerDeleteArtwork
            }
        >
            Delete ArtWork
        </Button>
    )
}
