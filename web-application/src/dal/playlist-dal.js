const conn = require("./db")
const util = require('util')
const err = require('../errors/error')
const db = util.promisify(conn.query).bind(conn)

module.exports = function(){
	
    return{

        
            /*CREATE TABLE playlists(
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                playlist_name VARCHAR(50) NOT NULL,
                list_owner VARCHAR(50),
                CONSTRAINT fk_list_owner FOREIGN KEY (list_owner) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE
            );
            
            
            CREATE TABLE podinlist(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pod_id VARCHAR(50) NOT NULL,
    playlist_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_pod FOREIGN KEY (pod_id) REFERENCES podcasts(pod_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_play FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE ON UPDATE CASCADE
);*/


        createPlaylist: async function(playlistName,user){

            const query = "INSERT INTO playlists(playlist_name, list_owner) VALUES(?, ?)" 
            const values = [playlistName, user]

            try{
                const response = await db(query,values)
                return response.insertId

            } catch (error){
                
                if(error.code == 'ER_DUP_ENTRY' && error.sqlMessage.includes('playlist_name_dup') ){
                   // throw err.err.DUP_PLAYLIST_ERROR
                }
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        addPodcastToPlaylist: async function(collectionId, playlistId){

            const query = "INSERT INTO podinlist(pod_id, playlist_id) VALUES(?, ?)" 
            const values = [collectionId, playlistId]
           
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

        removePodcastFromPlaylist: async function(collectionId, playlistId){
            
            const query = "DELETE FROM podinlist WHERE playlist_id = ? AND pod_id = ?"
            const values = [playlistId, collectionId]
            
            try {
                const response = await db(query, values)
                return response

            } catch (error) {
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },

        getAllPlaylistsByUser: async function(user){
            
            const query = "SELECT playlist_name, id FROM playlists WHERE list_owner = ?" 
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
        
            const query = "SELECT pl.playlist_name, p.pod_id FROM playlists pl LEFT JOIN podinlist p ON pl.id = p.playlist_id WHERE pl.list_owner = ?"
            const values = [user]

            try{
                const result = await db(query, values)
              
                return result

            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },
    
        removePlaylist: async function (playlistId, user){
            
            const query = "DELETE FROM playlists WHERE id = ? AND list_owner = ?"
            const values = [playlistId, user]
            
            try{
                const result = await db(query, values)
                return result

            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },
        
        getAllPodcastsByPlaylist: async function(playlistId){
            
            const query = "SELECT pod_id FROM podinlist WHERE playlist_id = ?"
            const values = [playlistId]
            try{
                return await db(query,values)

            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        },
        
        getPlaylistIdFromPlaylistName: async function(playlistName, user){
            const query = "SELECT id FROM playlists WHERE playlist_name = ? AND list_owner = ?"
            const values = [playlistName, user]
            try{
                const result =  await db(query,values)
                return result[0].id

            }catch(error){
                console.log(error)
                throw err.err.INTERNAL_SERVER_ERROR
            }
        }
    }
}
