// Importing the Post and Tag models to interact with their respective tables in the database.
// - Post represents the posts in the application, which can be tagged with multiple tags.
// - Tag represents categories or labels that can be associated with posts.
const { Post, Tag } = require('../models');

// Associate a tag with a post
// This function links an existing tag to an existing post by adding a tag to the post's associated tags.
exports.addTagToPost = async (req, res) => {
    try {
        const { tagId } = req.body;  // Extract the tagId from the request body

        // Find the post by its primary key (postId) in the URL parameter.
        // - This ensures the post exists before trying to associate a tag with it.
        const post = await Post.findByPk(req.params.postId);

        // Find the tag by its primary key (tagId) to ensure it exists in the database.
        const tag = await Tag.findByPk(tagId);

        // If either the post or tag doesn’t exist, return a 404 error.
        // - This prevents associating a tag with a post that doesn’t exist and vice versa.
        if (!post || !tag) {
            return res.status(404).json({ message: 'Post or Tag not found' });
        }

        // Add the tag to the post using the addTag method provided by Sequelize.
        // - addTag is a convenience method generated by Sequelize for many-to-many relationships.
        await post.addTag(tag);

        // Respond with a success message if the association was created successfully.
        res.status(200).json({ message: 'Tag added to post successfully' });
    } catch (error) {
        // If an error occurs, respond with a 500 status and the error message.
        // - This helps to catch and communicate issues such as database errors.
        res.status(500).json({ error: error.message });
    }
};

// Remove a tag from a post
// This function removes an association between a tag and a post, unlinking the tag from the post's tags.
exports.removeTagFromPost = async (req, res) => {
    try {
        const { tagId } = req.body;  // Extract the tagId from the request body

        // Find the post by its primary key (postId) from the URL parameter to ensure it exists.
        const post = await Post.findByPk(req.params.postId);

        // Find the tag by its primary key (tagId) to verify it exists in the database.
        const tag = await Tag.findByPk(tagId);

        // If either the post or tag is not found, return a 404 error.
        // - This prevents attempting to remove an association if either the post or tag doesn’t exist.
        if (!post || !tag) {
            return res.status(404).json({ message: 'Post or Tag not found' });
        }

        // Remove the tag from the post using the removeTag method generated by Sequelize.
        // - removeTag is used to delete the association between the post and the specified tag.
        await post.removeTag(tag);

        // Respond with a success message confirming the tag was removed from the post.
        res.status(200).json({ message: 'Tag removed from post successfully' });
    } catch (error) {
        // If an error occurs, respond with a 500 status and the error message.
        res.status(500).json({ error: error.message });
    }
};
