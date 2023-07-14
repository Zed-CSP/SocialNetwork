// const router = require("express").Router();
// const { User, Post, Comment, Like } = require("../../models");
// const bcrypt = require("bcrypt");
// require("dotenv").config();
// const withAuth = require("../../utils/auth");
// const upload = require("../../config/s3"); 

// // AWS S3 bucket configuration
// const bucketName = process.env.AWS_S3_BUCKET;
// const region = process.env.AWS_REGION;

// // Signup route GOOD
// router.post("/signup", async (req, res) => {
//   try {
//     // Check if the user already exists
//     const existingUser = await User.findOne({
//       where: { email: req.body.email },
//     });
//     if (existingUser) {
//       return res
//         .status(409)
//         .json({ message: "User with this email already exists" });
//     }

//     // Validate the user input
//     if (
//       !req.body.email ||
//       !req.body.password ||
//       !req.body.username ||
//       !req.body.date_of_birth 
//     ) {
//       return res
//         .status(400)
//         .json({
//           message: "All fields are required except for profile picture",
//         });
//     }
//     if (req.body.password.length < 8) {
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 8 characters" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);

//     // Create the user
//     const userData = await User.create({
//       email: req.body.email,
//       password: hashedPassword,
//       username: req.body.username,
//       date_of_birth: req.body.date_of_birth,
//       profile_picture: req.body.profile_picture || '/images/oh-no-space.gif', 
//     });

// // Create a session
// req.session.save(() => {
//   req.session.user_id = userData.id; 
//   req.session.username = userData.username; 
//   req.session.email = userData.email;
//   req.session.logged_in = true;
//   req.session.profile_picture = userData.profile_picture || '/images/oh-no-space.gif';
//   res.status(200).json(userData);
// });

//   } catch (err) {
//     console.error(err.message);
//     console.error(err.stack);
//     res.status(500).json(err);
//   }
// });

// // Login route GOOD
// router.post("/login", async (req, res) => {
//   try {
//     const userData = await User.findOne({ where: { email: req.body.email } });
//     if (!userData) {
//       res.status(404).json({ message: "No user with that email address!" });
//       return;
//     }

//     const validPassword = await userData.checkPassword(req.body);

//     if (!validPassword) {
//       res.status(400).json({ message: "Incorrect password!" });
//       return;
//     }

//     req.session.save(() => {
//       req.session.email = userData.email;
//       req.session.logged_in = true;
//       req.session.user_id = userData.id;
//       req.session.profile_picture = userData.profile_picture;
//       req.session.username = userData.username;

//       res.json({ user: userData, message: "You are now logged in!" });
  
//     });

//     console.log(req.session, "req.session");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Logout route GOOD
// router.post("/logout", async (req, res) => {
//     console.log(req.session, "req.session in /logout")
//   try {
//     if (req.session.logged_in) {
//       req.session.destroy(() => {
//         res.status(200).json({ message: "Logout successful" });
//       });
//     } else {
//       res.status(404).json({ message: "User not logged in" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// // Route to post a new post GOOD
// router.post("/post", withAuth, async (req, res) => {
//   console.log(req.body, "req.body in /post");
//   try {
//     const postData = await Post.create({
//       title: req.body.title,
//       content: req.body.content,
//       user_id: req.session.user_id, // Associate the post with the logged in user
//       profile_picture: req.session.profile_picture,
//     });

//     console.log(postData, "postData");

//     res.status(200).json(postData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Route to like a post GOOD
// router.post("/posts/:id/like", async (req, res) => {
//   console.log("route hit");
//   console.log(req.body, "req.body");
//   try {
//     const postId = req.params.id;
//     const userId = req.session.user_id; 


//     const post = await Post.findByPk(postId, {
//       include: { model: User, as: "likers" },
//     });
//     const user = await User.findByPk(userId, {
//       include: { model: Post, as: "likedPosts" },
//     });


//     if (!post || !user) {
//       return res.status(404).json({ message: "Post or user not found" });
//     }

//     if (req.body.like) {
//       // User wants to like the post
//       await post.addLikers(user);
//     } else {
//       // User wants to unlike the post
//       await post.removeLikers(user);
//     }

//     const updatedLikesCount = await post.countLikers();

//     console.log(updatedLikesCount, "updatedLikesCount");

//     res.json({ success: true, likesCount: updatedLikesCount });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false });
//   }
// });

// // Route to comment on a post GOOD
// router.post("/posts/:id/comment", withAuth, async (req, res) => {
//   try {
//     const postData = await Post.findOne({ where: { id: req.params.id } });
//     if (!postData) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const commentData = await Comment.create({
//       content: req.body.comment,
//       user_id: req.session.user_id,
//       post_id: req.params.id,
//     });

//     // Fetch the user who made the comment
//     const user = await User.findOne({ where: { id: req.session.user_id } });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       success: true,
//       comment: {
//         content: commentData.content,
//         id: commentData.id,
//         user_id: commentData.user_id,
//         username: user.username, // Include the username in the response
//       },
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Upload GOOD
// router.post("/upload", upload.single("upload-picture"), async (req, res) => {
//   const fileName = req.file.key; // the key of the uploaded file
//   console.log(fileName, "fileName here look this is it");
//   const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;


//   // Update the session
//   req.session.profile_picture = fileUrl;


//   // Update the database
//   try {
//     await User.update(
//       { profile_picture: fileUrl }, // new data to update
//       { where: { id: req.session.user.id } }
//     );
//   } catch (error) {
//     console.error("Failed to update profile_picture in the database:", error);
//   }

//   res.json({ message: "File uploaded successfully", fileUrl: fileUrl });
// });

// // update profile picture GOOD
// router.put("/update", withAuth, async (req, res) => {
//   try {
//     const user = await User.findOne({ where: { id: req.session.user_id } });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const newPicturePath = req.body.location; // Use req.body.location to get the URL

//     await user.update({ profile_picture: newPicturePath });
//     res.json({
//       message: "Profile picture updated successfully",
//       newPictureUrl: user.profile_picture,
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while updating the profile picture" });
//   }
// });


// // FUTURE DEVELOPMENT

// // update user name
// router.put("/update/username", withAuth, async (req, res) => {
// // need to add logic

// });

// // update user email
// router.put("/update/email", withAuth, async (req, res) => {
// // need to add logic

// });

// // update user password
// router.put("/update/password", withAuth, async (req, res) => {
// // need to add logic

// });

// module.exports = router;
