const Post = require('../models/Post'); // Assuming you have a Post model
const User = require('../models/User');

const personalizedFeed = async (userId) => {
    let feed = [];

    // Layer 1: User Interactions
    const userInteractions = await Post.find({ likedBy: userId }) // Assuming you have a 'likedBy' array in Post schema
    .limit(10); // Fetching last 10 liked posts
    feed = feed.concat(userInteractions);

    // Layer 2: Hashtags & Interests
    const user = await User.findById(userId);
    if (user && user.interests.length > 0) {
        const hashtagPosts = await Post.find({ hashtags: { $in: user.interests } }) // Assuming posts have a 'hashtags' array and users have an 'interests' array
        .limit(10);
        feed = feed.concat(hashtagPosts);
    }

    // Layer 3: Network
    // Assuming you have a 'friends' array in User schema
    // const friendsPosts = await Post.find({ createdBy: { $in: user.friends } })
    // .sort({ createdAt: -1 }) // Sort by most recent
    // .limit(10); 
    // feed = feed.concat(friendsPosts);

    // Layer 4: General Popularity
    // Here, you might need to decide what "popularity" means. For simplicity, let's say posts with most likes:
    const trendingPosts = await Post.find()
    .sort({ likedBy: -1 }) // Sort by number of likes
    .limit(10);
    feed = feed.concat(trendingPosts);

    // Combine & shuffle (if needed)
    // You can shuffle the feed to mix posts from different layers, but that's optional.

    return feed;
}

const getRandomFeed = async (limit = 5) => {
    // Fetch posts from the database
    const posts = await Post.find({}).limit(limit).exec();

    // Shuffle the posts
    const shuffledPosts = posts.sort(() => 0.5 - Math.random());

    return shuffledPosts;
}

module.exports = personalizedFeed, getRandomFeed;
