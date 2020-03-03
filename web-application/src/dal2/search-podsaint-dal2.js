const pgdb = require('./pgdb')

module.exports = function () {

    const Sequelize = require('sequelize')

    return {

        getPodcastWithNameOrCreator: async function (searchTerm) {
            
            //const result = await pgdb.sequelize.query("SELECT * FROM podcasts WHERE CONCAT(pod_name) LIKE '%"+"?"+"%' OR CONCAT(pod_creators) LIKE '%"+"?"+"%'",
            //{ replacements: [searchTerm], type : pgdb.sequelize.QueryTypes.SELECT })
            
            const result =  await pgdb.podcasts.findAll({
                
                where:{
                    [Sequelize.Op.or]: [
                             Sequelize.where(Sequelize.fn('concat', Sequelize.col('pod_name')),{
                               [Sequelize.Op.like]: '%'+searchTerm+'%'
                             }), { pod_creators: { [Sequelize.Op.like]: '%'+searchTerm+'%'} }]
                }
                
               /* where:[ Sequelize.where(Sequelize.fn('concat'), Sequelize.col('pod_name')),{
                    [Sequelize.Op.like]:'%'+searchTerm+'%'
                }],[Sequelize.Op.or]:[Sequelize.where(Sequelize.fn('concat'), Sequelize.col('pod_creators')),{
                    [Sequelize.Op.like]:'%'+searchTerm+'%'}
                    
                ]*/
               // where: { Sequelize.where(Sequelize.fn('concat'), Sequelize.col('pod_name')),
               // {[Sequelize.Op.like]: '%'+searchTerm+'%'}
                    
                //[Sequelize.Op.or]: [
                   //     Sequelize.where(Sequelize.fn('concat', Sequelize.col('pod_name')),{
                     //     [Sequelize.Op.like]: '%'+searchTerm+'%'
                       // }), { pod_creators: { [Sequelize.Op.like]: '%'+searchTerm+'%'} }
                    //]
                //}
            })
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>search pod")
            console.log(result)
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        },
        
        checkIfPodIsOverMinOverallRating: async function (podId, min) {
     
            const rating =  pgdb.podcasts.findAll({
                attributes: ['overall_rating'],
                where:{ pod_id: podId}
            })
            const average = await getAverageRatingsByPodcastId(podId, rating[0].overall_rating)
            return(average > min)
        },

        checkIfPodIsOverMinTopicRelevenceRating: async function (podId, min) {

            const rating = pgdb.podcasts.findAll({
                attributes: ['topic_relevence_rating'],
                where:{pod_id: podId}
            })
            const average = await getAverageRatingsByPodcastId(podId, rating[0].topic_relevence_rating)
            return(average > min)
        },

        checkIfPodIsOverMinProductionQualityRating: async function (podId, min) {

            const rating = pgdb.podcasts.findAll({
                attributes: ['production_quality_rating'],
                where:{pod_id: podId}
            })
            const average = await getAverageRatingsByPodcastId(podId, rating[0].production_quality_rating)
            return(average > min)
        },

        checkIfPodToneIsComedy: async function (podId){

            const response = await pgdb.podcasts.findAll({
                where:{pod_id: podId}
            })

            return(response[0].comedy_rating > response[0].drama_rating)
        }
    }
}

async function getNumberOfReviews(podId) {

    return await pgdb.reviews.findAndCountAll({
        where:{ pod_id: podId}
    })
}

async function getAverageRatingsByPodcastId(podId, rating) {

    try {
        const numberOfReviewsRaw = await getNumberOfReviews(podId)
        const numberOfReviews = await numberOfReviewsRaw.count

        console.log("REV NUM "+ numberOfReviews + " RATING" + rating)
        
        return rating/numberOfReviews

    } catch (error) {
        console.log("error in getAverageRatingsByPodcastId")
        console.log(error)
    }
}