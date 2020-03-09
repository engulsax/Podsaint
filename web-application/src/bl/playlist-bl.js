
const err = require('../errors/error')

module.exports = function ({ playlistDAL, podcastDAL, searchItunesBL, authBL }) {

    return {
       
        createPlaylist: async function(playlistName, user, userloginKey,collectionId, collectionName, artistName){
            try{
                if (authBL.isLoggedIn(userloginKey)) {

                    const playlistId = await playlistDAL.createPlaylist(playlistName,user)
                    const result = await this.addPodcastToPlaylist(playlistId, collectionId, collectionName, artistName, userloginKey)
                    return result

                } else {
                    throw err.err.AUTH_USER_ERROR
                }

            } catch (error){
                console.log(">>>>>>>>>>>>>>>errrrr>>>>>>>>>>")
                console.log(error)
            }
        },

        addPodcastToPlaylist: async function (playlistId, collectionId, collectionName, artistName, userloginKey) {

            try {
                if (authBL.isLoggedIn(userloginKey)) {
                    console.log(await podcastDAL.podcastExist(collectionId))

                    if (await podcastDAL.podcastExist(collectionId)) {
                        return await playlistDAL.addPodcastToPlaylist(collectionId, playlistId)
                    } else {
                        await podcastDAL.addPodcast(collectionId, collectionName, artistName)
                        return await playlistDAL.addPodcastToPlaylist(collectionId, playlistId)
                    }

                } else {
                    throw err.err.AUTH_USER_ERROR
                }

            } catch (error) {
                console.log(error)
                if(err.errorNotExist(error)){
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        removePodcastsFromPlaylist: async function (podcastsToRemove, playlistName, user, userloginKey) {

            try {

                if (authBL.isLoggedIn(userloginKey)) {
                    if(!podcastsToRemove){
                        throw err.err.REMOVE_PODCAST_PLAYLIST_ERROR
                    }

                    if (typeof podcastsToRemove === 'string') {
                        podcastsToRemove = [podcastsToRemove]
                    }

                    const playlistId = await playlistDAL.getPlaylistIdFromPlaylistName(playlistName, user)

                    for (let i = 0; i < podcastsToRemove.length; i++) {
                        await playlistDAL.removePodcastFromPlaylist(podcastsToRemove[i], playlistId)
                    }
                } else {
                    throw err.err.AUTH_USER_ERROR
                }
            } catch (error) {
                console.log(error)
                if(err.errorNotExist(error)){
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        removePlaylist: async function (playlistName, user, userloginKey) {
            try {
                if (authBL.isLoggedIn(userloginKey)) {
                    console.log("HÄRÄHÄHÄÄHÄHÄHÄHÄHÄHÄHÄHÄHÄHÄHÄHÄHÄHÄ")
                    const playlistId = await playlistDAL.getPlaylistIdFromPlaylistName(playlistName, user)
                    console.log("PÖLAYLALYLALYLAYLAYL")
                    console.log(playlistId)
                    
                    return await playlistDAL.removePlaylist(playlistId, user)
                } else {
                    throw err.err.AUTH_USER_ERROR
                }

            } catch (error) {
                console.log(error)
                if(err.errorNotExist(error)){
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        getAllPlaylistsByUser: async function (userloginKey) {

            try {
                if (authBL.isLoggedIn(userloginKey)) {

                    const result = await playlistDAL.getAllPlaylistsByUser(userloginKey.user)
                    return result
                } else {
                    throw err.err.AUTH_USER_ERROR
                }
            } catch (error) {
                console.log(error)
                if(err.errorNotExist(error)){
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        getAllPlaylistsAndPodcastsByUser: async function (userloginKey) {
            try {

                if (authBL.isLoggedIn(userloginKey)) {
                  
                    const result = await playlistDAL.getAllPlaylistsAndPodcastsByUser(userloginKey.user)
                   
                    let podcastList = []
                    let val = {}
                    
                    for (let i = 0; i < result.length; i++) {
                       
                        if (result[i].pod_id != null){
                            const podInfo = await searchItunesBL.searchPodcast(result[i].pod_id)
                            val.podcastInfo = podInfo.results[0]

                        }
                        val.playlistName = result[i].playlist_name
                        podcastList.push(val)
                        val = {}
                    }

                    let sortRes = podcastList.reduce(function (obj, item) {
                        obj[item.playlistName] = obj[item.playlistName] || []
                        obj[item.playlistName].push(item.podcastInfo)
                        return obj;
                    }, {})

                    sortedResult = Object.entries(sortRes).map(([playlistName, podcastInfo]) => ({ playlistName, podcastInfo }))
                    
                    return (sortedResult)
                }
                throw err.err.AUTH_USER_ERROR

            } catch (error) {
                console.log(error)
                if(err.errorNotExist(error)){
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        getAllPodcastsByPlaylist: async function (user, playlistName, userloginKey) {
            try {
                if (authBL.isLoggedIn(userloginKey)) {
                    const playlistId = await playlistDAL.getPlaylistIdFromPlaylistName(playlistName, user)
                    const result = await playlistDAL.getAllPodcastsByPlaylist(playlistId)
                    
                    if(result.length == 0){
                        return [{playlistName: playlistName}]
                    }
                    
                    let podcastList = []
                    let val = {}

                    for (let i = 0; i < result.length; i++) {

                        if (result[i].pod_id != null) {
                            const podInfo = await searchItunesBL.searchPodcast(result[i].pod_id)
                            val.podcastInfo = podInfo.results[0]
                        }

                        val.playlistName = playlistName
                        podcastList.push(val)
                        val = {}
                    }
                    console.log(val)

                    let sortRes = podcastList.reduce(function (obj, item) {
                        obj[item.playlistName] = obj[item.playlistName] || []
                        obj[item.playlistName].push(item.podcastInfo)
                        return obj;
                    }, {})

                    sortedResult = Object.entries(sortRes).map(([playlistName, podcastInfo]) => ({ playlistName, podcastInfo }))
                    console.log(sortedResult)
                    return (sortedResult)
                    
                }
                throw err.err.AUTH_USER_ERROR
            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },
    }
}