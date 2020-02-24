

module.exports = function ({playlistDAL, podcastDAL, searchItunesBL}) {
    
    
    
    return{

        addPodcastToPlaylist: async function(collectionId, playlistName, user, collectionName, artistName){
            try{
                const podCast = await podcastDAL.getPodcastById(collectionId)
                
                if(podCast){
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
                console.log(podcastsToRemove)
                console.log(playlistName)
                console.log(user)
            try{
                for(let i = 0; i < podcastsToRemove.length; i++){
                    await playlistDAL.removePodcastFromPlaylist(podcastsToRemove[i],playlistName,user)
                }
            }catch(error){

            }

        },

        uppdatePodCastPlaylist: async function (collectionId, playlistName, user){

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

        deletePlaylist: async function (collectionId, playlistName, user){


        }
    }
}