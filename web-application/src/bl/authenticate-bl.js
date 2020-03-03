
module.exports = function ({ errors }) {

    return {
        isLoggedIn: function (userId) {
            console.log(`USER ID: ---------------------- ${userId}`)
            return(userId)
        }
    }
}
