
const reviewDAL = require('../dal/podcast-dal')


exports.newPodcastReview = async function newPodcastReview(collectionId, comedyRating, factRating, productionQualty, overallRating, reviewText, seriousnessRating) {
   
    try {
       
        return await reviewDAL.newPodcastReview(collectionId, comedyRating, factRating, productionQualty, overallRating, reviewText, seriousnessRating)

    }catch{
        //error
        console.log("podcast-bl-error")
          
    }
}

exports.getAllReviewsByPodcastId = async function getAllReviewsByPodcastId(collectionId){

    try{
        return await reviewDAL.getAllReviewsByPodcastId(collectionId)
    }catch{
        //error
        console.log("get all reviewsbypodcastid error")
        
    }
}
