

module.exports = function ({playlistDAL, podcastDAL, searchItunesBL}) {
    
    
    
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
            }
        },

        removePodcastsFromPlaylist: async function(podcastsToRemove, playlistName, user){
            
            try { 
                if (typeof podcastsToRemove === 'string') {
                    podcastsToRemove = [podcastsToRemove]
                }

                for (let i = 0; i < podcastsToRemove.length; i++) {
                    console.log("testtesttest")
                    console.log(i)
                    await playlistDAL.removePodcastFromPlaylist(podcastsToRemove[i], playlistName, user)
                }
                return
            } catch (error) {
                console.log("ERRRROR in removepodfromlist")
                console.log(error)

            }
        },
        
        removePlaylist: async function (playlistName, user){
            try{
                return await playlistDAL.removePlaylist(playlistName, user)

            }catch(error){
                console.log(error)
            }
        },
        getAllPlaylistsByUser: async function (user){
            
            try{
                console.log("---------------------playlists-bl-------------------------")
                return await playlistDAL.getAllPlaylistsByUser(user)

            }catch (error){
                console.log("---------------------playlists bl catch-------------------------")
                console.log(error)
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
            }
        },
    }
}