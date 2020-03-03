const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres', 'root', 'theRootPassword', {
    dialect: 'postgres',
    port: '5432',
    host: 'host.docker.internal'
  })

  exports.users = sequelize.define('users', {
    username:{
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        autoIncrement:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey: false
    },
    id:{
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: false,
        autoIncrement: true
    },
    password:{
        type: Sequelize.TEXT,
        allowNull: false
    }
  }, {timestamps:false}) 

  exports.podcastlists = sequelize.define('podcastlists', {

    id:{
        alowNull:false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    list_owner: {
        type: Sequelize.TEXT,
        allowNull:false,
        primaryKey: false,
        unique: 'podlist_unique',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references:{
            model: 'users',
            key: 'username'
        }
    },
    name: {
        unique: 'podlist_unique',
        type: Sequelize.TEXT,
        allowNull:false,
        primaryKey:false,
    },
    pod_id: {
        unique: 'podlist_unique',
        type: Sequelize.TEXT,
        allowNull:false,
        primaryKey:false,
    },
  }, 
  {timestamps:false},
  {uniqueKeys:{fields:['list_owner','name','pod_id']}
}) 


  exports.podcasts = sequelize.define('podcasts', {

        pod_id : {
            type: Sequelize.TEXT,
            primaryKey: true,
            allowNull : false
        },
        pod_name: {
            type: Sequelize.TEXT,
            primaryKey:false     
        }, 
        pod_creators: {
            type: Sequelize.TEXT,
            primaryKey: false
        },
        comedy_rating: {
            type: Sequelize.INTEGER,
            primaryKey: false
        },
        drama_rating: {
            type: Sequelize.INTEGER,
            primaryKey: false
        },
        topic_relevence_rating: {
            type: Sequelize.INTEGER,
            primaryKey: false
        },
        production_quality_rating: {
            type: Sequelize.INTEGER,
            primaryKey: false
        },
        overall_rating: {
            type:Sequelize.INTEGER,
            primaryKey: false
        }
  }, {timestamps:false}) 

  exports.reviews = sequelize.define('reviews', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    review_poster: {
        type: Sequelize.TEXT,
        primaryKey: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'users',
            key: 'username'
        }
    },
    post_date: {
        type: Sequelize.DATE
    },
    pod_id: {
        type: Sequelize.TEXT,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'podcasts',
            key: 'pod_id'
        }
    },
    comedy_rating: {
        type: Sequelize.INTEGER
    },
    drama_rating: {
        type: Sequelize.INTEGER
    },
    topic_relevence_rating: {
        type: Sequelize.INTEGER
    },
    production_quality_rating: {
        type: Sequelize.INTEGER
    },
    overall_rating: {
        type: Sequelize.INTEGER
    },
    review_text: {
        type:Sequelize.TEXT
    }

}, {timestamps:false}) 


  sequelize.sync().then(function(){
    console.log('DB connection sucessful.')
}, function(err){
    console.log(err)
})

exports.sequelize
