
const pgdb = require('./pgdb')
const err = require('../errors/error')

module.exports = function({}){
	

    return{

        createPlaylist: async function(playlistName, user){

            try{
             
                const result = await pgdb.playlists.create({
                    playlist_name: playlistName,
                    list_owner: user
                })
                console.log("---------------------------result from createplaylistdal>>>>>>")
                console.log(result.dataValues.id)
                console.log("---------------------------result from createplaylistdal>>>>>>")
                return result.dataValues.id
                

            } catch (error){
                console.log("createplaylistdal>>>>>>error")
                console.log(error)
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
                console.log("addpodcasttoplaylistdal>>>>>>error")
                console.log(error)
                if (error.errors[0].path == 'unique violation'){
                    throw err.err.DUP_PODCAST_PLAYLIST_ERROR

                } else{
                    
                    throw err.err.INTERNAL_SERVER_ERROR
                }
            }
        },
        //kommit hit
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

        getAllPlaylistsByUser: async function(user){
            
            try {
                const result =  await pgdb.playlists.findAll({
                    attributes: ['playlist_name', 'id'], 
                    where: {list_owner: user}
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
                /*
                const result = await pgdb.podinlist.findAll({
                    attributes:['pod_id'],
                    include:[
                        {model:pgdb.playlists,
                        attributes:['playlist_name'],
                        required:false
                    }]
                })
                */

                const result = await pgdb.playlists.findAll({
                    attributes:['playlist_name'],
                    include:[{
                        model: pgdb.podinlist,
                        attributes:['pod_id'],
                        required:false
                    }]
                })
                console.log(result)
                //console.log(result[0].podinlists)
                const data = []
                for(let i = 0; i <result.length;i++){
                    if(result[i].dataValues.podinlists[0]){
                        console.log(result[i].dataValues.podinlists.length)
                        for(let j = 0;j < result[i].dataValues.podinlists.length; j++){
                            console.log(j)
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
                console.log(data)
                return data

            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },
    
        removePlaylist: async function (playlistId, user){
           
            try{
                return await pgdb.playlists.destroy({
                    where: {
                        id: playlistId,
                        list_owner: user
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
        
        getPlaylistIdFromPlaylistName: async function(playlistName, user){
        
            try{
                
                const result = await pgdb.playlists.findAll({
                    attributes: ['id'],
                    where:{
                        playlist_name: playlistName,
                        list_owner: user
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


