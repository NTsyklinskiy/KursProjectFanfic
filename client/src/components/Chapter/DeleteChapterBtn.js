import { useMutation } from '@apollo/client';
import { Button } from '@material-ui/core'
import React from 'react'
import { DELETE_CHAPTER } from '../../utils/graphql'

export const DeleteChapterBtn = ({history, chapterId, imagePublicId, chapterClick, setChapterClick}) => {

    const [DeleteChapter, {data, error,loading}] = useMutation(DELETE_CHAPTER);

    const handlerDeleteChapter = async(e) => {
        e.preventDefault()
        await DeleteChapter({
            variables: {input: {
                chapterId,
		        imagePublicId
            }},
            update(cache, {data: {deleteChapter}}){
                setChapterClick(!chapterClick);
                cache.evict(cache.identify(deleteChapter));
            }
        });
    }
    
    return (
        <Button
        style={{ backgroundColor: 'red'}}
        onClick={
            handlerDeleteChapter
        }
        >
            Delete Chapter
        </Button>
    )
}
