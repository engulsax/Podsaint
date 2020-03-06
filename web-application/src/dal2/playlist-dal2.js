
const pgdb = require('./pgdb')
const err = require('../errors/error')

module.exports = function({}){
	

    return{

        addPodcastToPlaylist: async function(collectionId, playlistName, user){
           
            try {
                return await pgdb.podcastlists.create({
                    name: playlistName, 
                    list_owner: user, 
                    pod_id: collectionId
                })

            } catch (error) {
                
                console.log(error)
                if (error.errors[0].path == 'unique violation'){
                    throw err.err.DUP_PODCAST_PLAYLIST_ERROR

                } else{
                    throw err.err.INTERNAL_SERVER_ERROR
                }
            }
        },

        removePodcastFromPlaylist: async function(collectionId, playlistName, user){  
            
            try {
                return await pgdb.podcastlists.destroy({ 
                    where: { 
                        name: playlistName, 
                        list_owner: user, 
                        pod_id: collectionId} 
                    })

            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        getAllPlaylistsByUser: async function(user){
            
            try {
                const result =  await pgdb.podcastlists.findAll({
                    attributes: ['name'],
                    group: 'name', 
                    where: {list_owner: user}
                })
                
                const playlists= []
                for(let i = 0; i < result.length; i++){
                    playlists.push(result[i].dataValues)
                }
                return playlists

            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        getAllPlaylistsAndPodcastsByUser: async function(user){

            try{
                const result =  await pgdb.podcastlists.findAll({
                    attributes: ['name', 'pod_id'],
                    where: {list_owner: user},
                    order: [ ['name'] ]
                })
                const playlists= []
                for(let i = 0; i < result.length; i++){
                    playlists.push(result[i].dataValues)
                }
                return playlists

            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },
    
        removePlaylist: async function (playlistName, user){
           
            try{
                return await pgdb.podcastlists.destroy({
                    where: {
                        name: playlistName,
                        list_owner: user
                    }
                })
            
            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        getAllPodcastsByPlaylist: async function(user, playlistName){

            try{
                return await pgdb.podcastlists.findAll({
                    attributes: ['pod_id'],
                    where: {
                        list_owner: user,
                        name: playlistName
                    }
                })
         
            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        }
    }
}


