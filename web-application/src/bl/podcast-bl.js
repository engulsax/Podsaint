
const reviewDAL = require('../dal/reviews-repository')



exports.newPodcastReview = async function newPodcastReview(collectionId,humorRating,factRating,productionQualty,overallRating,reviewText,seriousnessRating) {
   
    
    try {
        return await reviewDAL.newPodcastReview(collectionId,humorRating,factRating,productionQualty,overallRating,reviewText,seriousnessRating)

    }catch{
        //error
        console.log("podcast-bl-error")
        console.log(error)
        
    }

}
