
const err = require('../errors/error')

module.exports = function ({ playlistDAL, podcastDAL, searchItunesBL, authBL }) {

    return {

        addPodcastToPlaylist: async function (collectionId, playlistName, user, collectionName, artistName, userloginKey) {

            try {
                if (authBL.isLoggedIn(userloginKey)) {

                    if (await podcastDAL.podcastExist(collectionId)) {
                        await playlistDAL.addPodcastToPlaylist(collectionId, playlistName, user)
                    } else {
                        await podcastDAL.addPodcast(collectionId, collectionName, artistName)
                        await playlistDAL.addPodcastToPlaylist(collectionId, playlistName, user)
                    }
                } else {
                    throw err.err.AUTH_USER_ERROR
                }

            } catch (error) {
                console.log(error)
                if(err.errorExist(error)){
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        removePodcastsFromPlaylist: async function (podcastsToRemove, playlistName, user, userloginKey) {

            try {

                if (authBL.isLoggedIn(userloginKey)) {

                    if (typeof podcastsToRemove === 'string') {
                        podcastsToRemove = [podcastsToRemove]
                    }

                    for (let i = 0; i < podcastsToRemove.length; i++) {
                        await playlistDAL.removePodcastFromPlaylist(podcastsToRemove[i], playlistName, user)
                    }
                } else {
                    throw err.err.AUTH_USER_ERROR
                }
            } catch (error) {
                console.log(error)
                if(err.errorExist(error)){
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        removePlaylist: async function (playlistName, user, userloginKey) {
            try {
                if (authBL.isLoggedIn(userloginKey)) {
                    return await playlistDAL.removePlaylist(playlistName, user)
                } else {
                    throw err.err.AUTH_USER_ERROR
                }

            } catch (error) {
                console.log(error)
                if(err.errorExist(error)){
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
                if(err.errorExist(error)){
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
                    return (sortedResult)
                }
                throw err.err.AUTH_USER_ERROR

            } catch (error) {
                console.log(error)
                if(err.errorExist(error)){
                    error = err.err.INTERNAL_SERVER_ERROR
                }
                throw error
            }
        },

        getAllPodcastsByPlaylist: async function (user, playlist) {
            try {
                const result = await playlistDAL.getAllPodcastsByPlaylist(user, playlist)
                let podcastList = []
                let val = {}

                for (let i = 0; i < result.length; i++) {
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
                return (sortedResult)

            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },
    }
}