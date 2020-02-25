const conn = require("./db")
const util = require('util')
const db = util.promisify(conn.query).bind(conn)

module.exports = function({}){
	
    return{

        addPodcastToPlaylist: async function(collectionId, playlistName, user){

            const query = "INSERT INTO podcastlists(list_owner, name, pod_id) VALUES(?, ?, ?)" 
            const values = [user, playlistName, collectionId]
           
            try {
                const response = await db(query, values)
                return response

            } catch (error) {
                console.log("error in new podcast list")
                console.log(error)
            }
        },

        removePodcastFromPlaylist: async function(collectionId, playlistName, user){
            
            const query = "DELETE FROM podcastlists WHERE list_owner = ? AND name = ? AND pod_id = ?"
            const values = [user, playlistName, collectionId]
            
            try {
                const response = await db(query, values)
                return response

            } catch (error) {
                console.log("error in remove podcasts")
                console.log(error)
            }
        },

        getAllPlaylistsByUser: async function(user){
            
            const query = "SELECT name FROM podcastlists WHERE list_owner = ? GROUP BY name" 
            const values = [user]
           
            try {
                return await db(query, values)

            } catch (error) {
                console.log("error in new podcast list")
                console.log(error)
            }
        },

        getAllPlaylistsAndPodcastsByUser: async function(user){

            const query = "SELECT name, pod_id FROM podcastlists WHERE list_owner = ? ORDER BY name"
            const values = [user]

            try{
                const result = await db(query, values)
                return result

            }catch(error){
                console.log("error in get all playlists and podcasts")
                console.log(error)
            }
        },
    
        removePlaylist: async function (playlistName, user){
            
            const query = "DELETE FROM podcastlists WHERE name = ? AND list_owner = ?"
            const values = [playlistName,user]
            
            try{
                const result = await db(query, values)
                return result

            }catch(error){
                console.log("error in delete playlist")
                console.log(error)
            }
        },

        getAllPodcastsByPlaylist: async function(user, playlist){
            
            const query = "SELECT pod_id FROM podcastlists WHERE list_owner = ? AND name = ?"
            const values = [user, playlist]
            try{
                return await db(query,values)
            }catch(error){

            }
        }
    }
}
