exports.like = {
    Mutation: {
    createLike: async (root, {input:{userId, chapterId}}, { Like, Chapter, User }) => {
        let like = await new Like({ user: userId, chapter: chapterId }).save();

        await Chapter.findOneAndUpdate({ _id: chapterId }, { $push: { likes: like.id } });
        await User.findOneAndUpdate({ _id: userId }, { $push: { likes: like.id } });

        like = await like.populate('user').populate('chapter').execPopulate();

        return like;
    },
    deleteLike: async (root, { likeId }, { Like, User, Chapter }) => {
          const like = await Like.findByIdAndRemove(likeId);
          await User.findOneAndUpdate({ _id: like.user }, { $pull: { likes: like.id } });
          await Chapter.findOneAndUpdate({ _id: like.chapter }, { $pull: { likes: like.id } });
      
          return like;
        },
      }
}