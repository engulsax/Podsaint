const conn = require("./db")
const util = require('util')
const err = require('../errors/error')
const db = util.promisify(conn.query).bind(conn)

module.exports = function(){
	
    return{

        addPodcastToPlaylist: async function(collectionId, playlistName, user){

            const query = "INSERT INTO podcastlists(list_owner, name, pod_id) VALUES(?, ?, ?)" 
            const values = [user, playlistName, collectionId]
           
            try {
                const response = await db(query, values)
                return response

            } catch (error) {
                
                if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('playlist_dup')){
                    throw err.err.DUP_PODCAST_PLAYLIST_ERROR

                } else {
                    throw err.err.INTERNAL_SERVER_ERROR
                }
            }
        },

        removePodcastFromPlaylist: async function(collectionId, playlistName, user){
            
            const query = "DELETE FROM podcastlists WHERE list_owner = ? AND name = ? AND pod_id = ?"
            const values = [user, playlistName, collectionId]
            
            try {
                const response = await db(query, values)
                return response

            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        getAllPlaylistsByUser: async function(user){
            
            const query = "SELECT name FROM podcastlists WHERE list_owner = ? GROUP BY name" 
            const values = [user]
           
            try {
                const result = await db(query, values)
                return result

            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        getAllPlaylistsAndPodcastsByUser: async function(user){

            const query = "SELECT name, pod_id FROM podcastlists WHERE list_owner = ? ORDER BY name"
            const values = [user]

            try{
                const result = await db(query, values)
                return result

            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },
    
        removePlaylist: async function (playlistName, user){
            
            const query = "DELETE FROM podcastlists WHERE name = ? AND list_owner = ?"
            const values = [playlistName,user]
            
            try{
                const result = await db(query, values)
                return result

            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        getAllPodcastsByPlaylist: async function(user, playlistName){
            
            const query = "SELECT pod_id FROM podcastlists WHERE list_owner = ? AND name = ?"
            const values = [user, playlistName]
            try{
                return await db(query,values)
            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        }
    }
}
