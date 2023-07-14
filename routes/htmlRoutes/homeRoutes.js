const exppress = require('express');
const router = exppress.Router();
const { User, Post, Like, Comment } = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');

// Catch all non-user routes and render the homepage
router.get('/', async (req, res) => {
    try {
        const postsData = await Post.findAll({
            include: [
                { 
                    model: User, 
                    attributes: ['username'] 
                },
                {
                    model: Comment,
                    attributes: ['id', 'content', 'user_id'],
                    include: {
                      model: User, 
                      attributes: ['username'], 
                    },
                    order: [['created_at', 'DESC']], 
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        const posts = postsData.map(post => post.get({ plain: true }));
        
        res.render('nonUserHome', { posts });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Render the dashboard if the user is logged in
router.get('/dashboard', async (req, res) => {
    console.log(req.session, 'req.session in /dashboard')
    try {
        // Ensure the user is logged in
        if (!req.session.logged_in) {
            res.redirect('/login');
            return;
        }

        // Fetch user first
        const user = await User.findOne({
            where: { id: req.session.user_id },
            include: [
                { 
                    model: Post, 
                    as: 'likedPosts' 
                }
            ]
        });

        if (!user) {
            res.status(404).json({ message: 'No user with this id!' });
            return;
        }

        // Fetch all posts
        const postsData = await Post.findAll({
            include: [
                { 
                    model: User, 
                    attributes: ['username'] 
                },
                {
                    model: Comment,
                    attributes: ['id', 'content', 'user_id'],
                    include: {
                      model: User, 
                      attributes: ['username'], 
                    },
                    order: [['created_at', 'DESC']], 
                  }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        // Fetch likes count for each post
        
        const likesData = await Like.findAll({
            attributes: [
                'post_id',
                [sequelize.fn('count', sequelize.col('id')), 'likes_count']
            ],
            group: ['post_id']
        });
        
        let likesCountMap = {};
        likesData.forEach((like) => {
          likesCountMap[like.dataValues.post_id] = like.dataValues.likes_count;
        });
        
        // Combine posts, likes, and comments
        const posts = postsData.map((post) => {
            const postPlain = post.get({ plain: true });
            postPlain.likes_count = likesCountMap[post.id] || 0;
            

            postPlain.comments = post.comments.map(comment => comment.get({ plain: true }));
            
            // Check if user has liked this post
            postPlain.isLikedByCurrentUser = user.likedPosts.some(likedPost => likedPost.id === post.id);
            
            
            return postPlain;
        });
        

        res.render('dashboard', { 
            posts, 
            logged_in: req.session.logged_in,
            profile_picture: req.session.profile_picture,
            username: req.session.username
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});



router.get('/login', (req, res) => {   
    try{
        res.render('login')
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get('/signup', (req, res) => {
    try{
        res.render('signup')
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get('/account', withAuth, async (req, res) => {
    try {
    
        const userData = await User.findOne({
            where: {
                email: req.session.email
            },
            attributes: { exclude: ['password'] }  
        });
        
        console.log(userData, 'userData')

        if (!userData) {
          
            res.status(404).json({ message: 'No user found with this email!' });
            return;
        }

     
        const user = userData.get({ plain: true });


        
        res.render('account', {
             user,
            logged_in: req.session.logged_in,
            profile_picture: req.session.profile_picture,
             });

    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/post', withAuth, async (req, res) => {
    try {
        const userData = await User.findOne({
            where: {
                email: req.session.email
            },
            attributes: { exclude: ['password'] }  
        });
        
        console.log(userData, 'userData')

        if (!userData) {
          
            res.status(404).json({ message: 'No user found with this email!' });
            return;
        }

     
        const user = userData.get({ plain: true });


        
        res.render('post', {
             user,
            logged_in: req.session.logged_in,
            profile_picture: req.session.profile_picture,
             });

    } catch (err) {
        res.status(500).json(err);
    }
});






module.exports = router;