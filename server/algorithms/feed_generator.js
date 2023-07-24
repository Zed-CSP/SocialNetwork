const Post = require('../models/Post');
const User = require('../models/User');

async function generateFeed(userId) {
    const user = await User.findById(userId);
    let posts = [];

    if (user && user.interests.length > 0) {
        posts = await Post.find({
            hashtags: { $in: user.interests }
        })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('likes')
        .populate({ path: 'likes.user' })
        .populate({ path: 'user' })
        .populate({
            path: 'comments',
            populate: {
              path: 'user',
              model: 'User'
            }
        })
        .exec();
    }

    if (posts.length < 10) {
        const randomPosts = await Post.aggregate([{ $sample: { size: 10 - posts.length } }]);
        const randomPostIds = randomPosts.map(post => post._id);
        const populatedRandomPosts = await Post.find({_id: {$in: randomPostIds}})
            .populate('likes')
            .populate({ path: 'likes.user' })
            .populate({ path: 'user' })
            .populate({
                path: 'comments',
                populate: {
                  path: 'user',
                  model: 'User'
                }
            })
            .exec();
    
        posts = [...posts, ...populatedRandomPosts];
    }
    
    return posts;
}

module.exports = generateFeed;
