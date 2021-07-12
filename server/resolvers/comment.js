const { withFilter } = require("graphql-subscriptions");
const { pubSub } = require("../subscription");

exports.comment = {
    Query: {
        getComments: async(parent,{chapterId}, {Comment}) => {
            const comments = await Comment.find({chapter: chapterId}).populate([
                {path: 'chapter'},
                {path: 'author'}
            ])
            return comments
        }
    },
    Mutation: {
        createComment: async(parent, {input:{comment, author, chapterId}}, {User, Chapter, Comment}) => {
            let newComment = await new Comment({
                comment,
                author,
                chapter: chapterId,
              }).save();

              await Chapter.findOneAndUpdate({ _id: chapterId }, { $push: { comments: newComment.id } });
              await User.findOneAndUpdate({ _id: author }, { $push: { comments: newComment.id } });
          
              newComment = await newComment.populate('author').populate('chapter').execPopulate();

              pubSub.publish("CREATE_COMMENT", {
                commentCreated: newComment
              })

              return newComment;
        },
        deleteComment: async (parent, {commentId}, { Comment, User, Chapter }) => {
            const comment = await Comment.findByIdAndRemove(commentId).populate([
                {path: 'author'},
                {path: 'chapter'}
            ]);
            await User.findOneAndUpdate({ _id: comment.author.id }, { $pull: { comments: comment.id } });
            await Chapter.findOneAndUpdate({ _id: comment.chapter.id }, { $pull: { comments: comment.id } });

            pubSub.publish("CREATE_COMMENT", {
                commentCreated: comment
            })

        
            return comment;
          },
    },
    Subscription: {
        commentCreated: {
            subscribe: withFilter(
                () => pubSub.asyncIterator("CREATE_COMMENT"),
                (payload, variables, context) => {
                    return payload.commentCreated.chapter.id === variables.chapterId
                }
            )
        }    
    }
  };
  