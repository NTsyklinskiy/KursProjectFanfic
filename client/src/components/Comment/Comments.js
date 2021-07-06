import React, { useEffect } from 'react'
import {useQuery} from '@apollo/client'
import { Divider }from '@material-ui/core'
import Comment from './Comment'
import { AddComment } from './AddComment'
import {GET_COMMENTS, COMMENTS_CREATED} from '../../utils/graphql'


const Comments = ({chapter, user}) => {

    const {data, subscribeToMore,error, loading} = useQuery(GET_COMMENTS,{ 
        variables: {chapterId: chapter.id}
    })

  useEffect(()=> {
    const unsubscribe = subscribeToMore({
      document: COMMENTS_CREATED,
      variables: { chapterId: chapter.id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newComment = subscriptionData.data.commentCreated;
        if(prev.getComments.find(com => com.id === newComment.id)){
          const mergedComments = prev.getComments.filter(com => com.id !== newComment.id);
          return { getComments: mergedComments };
        }
        const mergedComments = [...prev.getComments, newComment];

        return { getComments: mergedComments };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore, chapter.id])
  

    return (
        <>
        <Divider />
        <Comment comments={data?.getComments || chapter.comments || []} user={user} />
        <AddComment chapter={chapter} user={user}/>
        </>
    )
}

export default Comments