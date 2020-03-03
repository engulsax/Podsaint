
const pgdb = require('./pgdb')

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
                console.log("----ERRRRROOORRRR PLAYLIST NUMBAH ONE---- " + JSON.stringify(error))
                throw error
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
                console.log("----ERRRRROOORRRR PLAYLIST NUMBAH TWO---- " + JSON.stringify(error))
                throw error
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
                console.log("----ERRRRROOORRRR PLAYLIST NUMBAH THREE---- " + JSON.stringify(error))
                throw error
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
                console.log("----ERRRRROOORRRR PLAYLIST NUMBAH FOUR---- " + JSON.stringify(error))
                throw error
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
                console.log("----ERRRRROOORRRR PLAYLIST NUMBAH FIVE---- " + JSON.stringify(error))
                throw error
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
                console.log("----ERRRRROOORRRR PLAYLIST NUMBAH SIX---- " + JSON.stringify(error))
                throw error
            }
        }
    }
}


