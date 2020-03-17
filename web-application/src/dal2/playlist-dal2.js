
const pgdb = require('./pgdb')
const err = require('../errors/error')

module.exports = function({}){
	

    return{

        createPlaylist: async function(playlistName, username){

            try{

                if(playlistName == ""){
                    throw err.err.PLAYLIST_NAME_ERROR
                }
             
                const result = await pgdb.playlists.create({
                    playlist_name: playlistName,
                    list_owner: username
                })
            
                return result.dataValues.id
                
            } catch (error){
                console.log(error)

                if(error == err.err.PLAYLIST_NAME_ERROR){
                    throw err.err.PLAYLIST_NAME_ERROR
                }

                if(error.errors[0].path == 'unique violation'){
                    throw err.err.DUP_PLAYLIST_ERROR
                }
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        addPodcastToPlaylist: async function(collectionId, playlistId){
           
            try {
                return await pgdb.podinlist.create({
                    playlist_id: playlistId, 
                    pod_id: collectionId
                })

            } catch (error) {
                console.log(error)

                if(error.errors[0].type == 'notNull Violation'){
                    throw err.err.PLAYLIST_ADD_ERROR
                }

                if (error.errors[0].type == 'unique violation'){
                    throw err.err.DUP_PODCAST_PLAYLIST_ERROR

                } else{
                    
                    throw err.err.INTERNAL_SERVER_ERROR
                }
            }
        },
   
        removePodcastFromPlaylist: async function(collectionId, playlistId){  
            
            try {
                return await pgdb.podinlist.destroy({ 
                    where: { 
                        playlist_id: playlistId, 
                        pod_id: collectionId} 
                    })

            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        getAllPlaylistsByUser: async function(username){
            
            try {

                const result =  await pgdb.playlists.findAll({
                    attributes: ['playlist_name', 'id'], 
                    where: {list_owner: username}
                })
                console.log("result from getallplaylistsfromuser")
                console.log(result)
                
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

        getAllPlaylistsAndPodcastsByUser: async function(username){

            try{
               

                const result = await pgdb.playlists.findAll({
                    attributes:['playlist_name'],
                    where:{ list_owner: username},
                    include:[{
                        model: pgdb.podinlist,
                        attributes:['pod_id'],
                        required:false
                    }]
                })
    
                const data = []
                for(let i = 0; i <result.length;i++){
                    if(result[i].dataValues.podinlists[0]){
            
                        for(let j = 0;j < result[i].dataValues.podinlists.length; j++){
                          
                            data.push({
                                playlist_name: result[i].dataValues.playlist_name,
                                pod_id: result[i].dataValues.podinlists[j].pod_id
                            })
                        }
                    }else{
                        data.push({
                            playlist_name: result[i].dataValues.playlist_name,
                            pod_id: null
                        })
                    }
                }
           
                return data

            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },
    
        removePlaylist: async function (playlistId, username){
           
            try{
                return await pgdb.playlists.destroy({
                    where: {
                        id: playlistId,
                        list_owner: username
                    }
                })
            
            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        getAllPodcastsByPlaylist: async function(playlistId){

            try{
    
                const result = await pgdb.podinlist.findAll({
                    attributes: ['pod_id'],
                    where: { playlist_id: playlistId }
                })
                const data = []
                for(let i = 0; i <result.length; i++){
                    data.push(result[i].dataValues)
                }

                return data

            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },
        
        getPlaylistIdFromPlaylistName: async function(playlistName, username){
        
            try{
                
                const result = await pgdb.playlists.findAll({
                    attributes: ['id'],
                    where:{
                        playlist_name: playlistName,
                        list_owner: username
                    }
                })

                return result[0].dataValues.id
    
            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        }
    }
}


