import React, {useState} from 'react'
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  TextField,
  Button,
  makeStyles
} from "@material-ui/core";
import { useMutation } from '@apollo/client';
import { CREATE_COMMENT, GET_COMMENTS } from '../../utils/graphql';

const useStyles = makeStyles(theme => ({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper
    },
    fonts: {
      fontWeight: "bold"
    },
    inline: {
      display: "inline"
    }
  }));
  
export const AddComment = ({chapter,user}) => {
    const classes = useStyles()
    const [comment, setComment] = useState('')

    const [CreateComment, {loading}] = useMutation(CREATE_COMMENT)
    return (
        <List className={classes.root}>
           {user && 
            (<>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="avatar"  />
              </ListItemAvatar>
                <TextField 
                  multiline={true} 
                  name="comment" 
                  variant={'outlined'} 
                  value={comment}
                  style={{width: '100%', height: "100%"}}
                  onChange={(e)=> {
                    setComment(e.target.value)
                  }}
                />
                <Button 
                  type="submit"
                  onClick={async() => {
                    await CreateComment({
                      variables: {
                        input: {
                          comment,
                          chapterId: chapter.id,
                          author: user.id
                        }
                      },
                      update(cache, {data: {createComment}}) {
                        console.log(createComment);
                        // const {getComments} = cache.readQuery({
                        //   query: GET_COMMENTS,
                        //   variables: {
                        //     chapterId: chapter.id
                        //   }
                        // })
                        // console.log(getComments);
                        // cache.writeQuery({
                        //   query: GET_COMMENTS,
                        //   variables: {
                        //     chapterId: chapter.id
                        //   },
                        //   data: {
                        //     getComments: [...getComments,createComment ]
                        //   }
                        // })
                        setComment('')
                      }
                    })
                    
                  }}
                >
                  Add
                </Button>
               </ListItem>
             </>
             )
                }
        </List>
    )
}
