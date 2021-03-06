const Post = require('../models/post.model');
const Review = require('../models/review.model');


module.exports = {
    createReview: async (req, res, next) => {

        const post = await Post.findById(req.params.id).populate('reviews').exec();
        const haveReviewed = post.reviews.filter(review => review.author == req.user._id).length;
        console.log(haveReviewed);
        if (haveReviewed) {
            req.session.error = "Sorry you can only review a post once";
            res.redirect(`/posts/${post._id}`)
        } else {
            const initialPostLength = await post.reviews.length
            req.body.author = req.user._id;
            let review = await Review.create(req.body);

            post.reviews.push(review);
            let saved = await post.save();
            if (initialPostLength < saved.reviews.length) {
                req.session.success = 'Well done! You successfully created a review for this post';
                res.redirect(`/posts/${post._id}`);
            } else {
                req.session.error = 'Ouch! Review for this post could not be created. Something went wrong';
                res.redirect(`/posts/${post._id}`);
            }
        }
    },

    updateReview: async (req, res, next) => {
        const post = await Post.findById(req.params.id);
        const review = await Review.findById(req.params.review_id);
        req.body.author = req.user._id;
        req.body.content !== review.content ? review.content = req.body.content : null;
        req.body.rating !== review.rating ? review.rating = req.body.rating : null;

        review.save();
        req.session.success = `Well done! You successfully updated review`;
        await res.redirect(`/posts/${req.params.id}`);
    },

    deleteReview: async (req, res, next) => {

        req.body.author = req.user._id;
        const post = await Post.findByIdAndUpdate(req.params.id, {
            pull: { reviews: req.params.review_id }
        });
        const review = await Review.findById(req.params.review_id);
        review.remove();
        req.session.success = `Well done! You successfully deleted review`;
        await res.redirect(`/posts/${req.params.id}`);
    }
}