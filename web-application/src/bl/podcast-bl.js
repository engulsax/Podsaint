
const reviewDAL = require('../dal/podcast-dal')

const DRAMA = 0
const COMEDY = 1


exports.newPodcastReview = async function newPodcastReview(collectionId, toneRating, topicRelevence, productionQualty, overallRating, reviewText) {

    let dramaRating = 0
    let comedyRating = 0
    if(toneRating === COMEDY){
        comedyRating = 1
    } else {
        dramaRating = 1
    }
   
    try {
        console.log("kommit hit hit")

        return await reviewDAL.newPodcastReview(collectionId, comedyRating, dramaRating, topicRelevence, productionQualty, overallRating, reviewText)

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
