const pgdb = require('./pgdb')

module.exports = function({}){
  
      return{

        userRegistration: async function(username,password, email){
            try{
                return await pgdb.users.create({
                    username: username, 
                    email: email,
                    password: password
                })

            }catch(error){
                console.log("----ERRRRROOORRRR---- " + JSON.stringify(error))
                throw error
            }
        },

        getUser: async function(username){
            try{
                return await pgdb.users.findAll({ 
                    where: { username: username } 
                })

            }catch(error){
                console.log("----ERRRRROOORRRR NUMBAH TWO---- " + JSON.stringify(error))
                throw error
            }
        },

        updateEmail: async function(username, email){
            try{
                return await pgdb.users.update(
                    { email: email },
                    { where: { username: username } 
                })

            }catch(error){
                console.log("----ERRRRROOORRRR NUMBAH THREE---- " + JSON.stringify(error))
                throw error
            }
        },

        updatePassword: async function(username, password){
            try{
                return await pgdb.users.update(
                    { password: password },
                    { where: { username: username } 
                })

            }catch(error){
                console.log("----ERRRRROOORRRR NUMBAH FOUR---- " + JSON.stringify(error))
                throw error
            }
        },

        deleteAccount: async function(username){
            try{
                return await pgdb.users.destroy(
                    { where: { username: username } 
                })

            }catch(error){
                console.log("----ERRRRROOORRRR NUMBAH FIVE---- " + JSON.stringify(error))
                throw error
            }

        }
      }
}


