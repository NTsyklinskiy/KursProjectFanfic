import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Button
} from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { DELETE_COMMENT } from "../../utils/graphql";

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


const Comment = ({ comments, user }) => {
  const classes = useStyles();
  const [DeleteComment, {loading}] = useMutation(DELETE_COMMENT)
  
  return (
    <List className={classes.root}>
      {comments.length !== 0  ? comments.map(comment => {
        // console.log("Comment", comment);
        return (
            <Fragment key={comment.id}>
            <ListItem alignItems="flex-start" style={{position: 'relative'}}>
              <ListItemAvatar>
                <Avatar alt="avatar"  />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography className={classes.fonts}>
                    {comment?.author.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {comment.author.email}
                    </Typography>
                    {` - ${comment.comment}`}
                    {user.id === comment?.author?.id &&
                      <Button
                      style={{position:'absolute', top: 0, right: 0}}
                      onClick={async(e)=> {
                        await DeleteComment({
                          variables: { commentId: comment.id}
                        })
                        
                      }}
                    >
                      Delete
                    </Button>
                    }
                  </>
                }
              />
            </ListItem>
        <Divider />

            </Fragment>
        );
      }): (<p>No Comments</p>)}
      <Divider />
    </List>
  );
};

export default Comment;