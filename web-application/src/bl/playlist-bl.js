

module.exports = function ({playlistDAL, podcastDAL, searchItunesBL, errors, authBL}) {
    
    return{

        addPodcastToPlaylist: async function(collectionId, playlistName, user, collectionName, artistName){
            try{
                const podcast = await podcastDAL.getPodcastById(collectionId)
                
                if(podcast){
                   await playlistDAL.addPodcastToPlaylist(collectionId, playlistName, user)

                }else{
    
                    await podcastDAL.addPodcast(collectionId, collectionName, artistName)
                    await playlistDAL.addPodcastToPlaylist(collectionId, playlistName, user)
                }

            }catch(error){
                console.log(error)
                throw new Error(errors.errors.INTERNAL_SERVER_ERROR)
            }
        },

        removePodcastsFromPlaylist: async function(podcastsToRemove, playlistName, user){
            
            try { 
                if (typeof podcastsToRemove === 'string') {
                    podcastsToRemove = [podcastsToRemove]
                }

                for (let i = 0; i < podcastsToRemove.length; i++) {
                    await playlistDAL.removePodcastFromPlaylist(podcastsToRemove[i], playlistName, user)
                }
                return
            } catch (error) {
                console.log(error)
                throw new Error(errors.errors.INTERNAL_SERVER_ERROR)
            }
        },
        
        removePlaylist: async function (playlistName, user){
            try{
                if(authBL.isLoggedIn(userloginKey)){
                    return await playlistDAL.removePlaylist(playlistName, user)
                } else {
                    throw new Error(errors.errors.AUTH_USER_ERROR)
                }

            }catch(error){
                console.log(error)
                throw new Error(errors.errors.INTERNAL_SERVER_ERROR)
            }
        },

        getAllPlaylistsByUser: async function (userloginKey){
            
            try{
                if(authBL.isLoggedIn(userloginKey)){
                    return await playlistDAL.getAllPlaylistsByUser(userloginKey.user)
                }
            }catch (error){
                console.log(error)
                throw new Error(errors.errors.INTERNAL_SERVER_ERROR)
            }
        },

        getAllPlaylistsAndPodcastsByUser: async function (user){
          try{
           
            const result = await playlistDAL.getAllPlaylistsAndPodcastsByUser(user)
            let podcastList = []
            let val = {} 
            
            for(let i = 0; i < result.length; i++){
                const podInfo = await searchItunesBL.searchPodcast(result[i].pod_id)
                val.playlistName = result[i].name
                val.podcastInfo = podInfo.results[0]
                podcastList.push(val)
                val = {}
            }
            
            let sortRes = podcastList.reduce(function (obj, item) {
                obj[item.playlistName] = obj[item.playlistName] || []
                obj[item.playlistName].push(item.podcastInfo)
                return obj;
            }, {})

            sortedResult = Object.entries(sortRes).map(([playlistName, podcastInfo]) => ({ playlistName, podcastInfo }))
            return(sortedResult)

          }catch(error){
            console.log(error)
            throw new Error(errors.errors.INTERNAL_SERVER_ERROR)
          }   
        },

        getAllPodcastsByPlaylist: async function(user, playlist){
            try{
                const result = await playlistDAL.getAllPodcastsByPlaylist(user,playlist)
                let podcastList = []
                let val = {} 
                
                for(let i = 0; i < result.length; i++){
                    const podInfo = await searchItunesBL.searchPodcast(result[i].pod_id)
                    val.playlistName = playlist
                    val.podcastInfo = podInfo.results[0]
                    podcastList.push(val)
                    val = {}
                }
                
                let sortRes = podcastList.reduce(function (obj, item) {
                    obj[item.playlistName] = obj[item.playlistName] || []
                    obj[item.playlistName].push(item.podcastInfo)
                    return obj;
                }, {})
    
                sortedResult = Object.entries(sortRes).map(([playlistName, podcastInfo]) => ({ playlistName, podcastInfo }))
                return(sortedResult)

            }catch(error){
                console.log(error)
                throw new Error(errors.errors.INTERNAL_SERVER_ERROR)
            }
        },
    }
}