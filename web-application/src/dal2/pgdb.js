const Sequelize = require('sequelize')

const sequelize = new Sequelize('postgres', 'root', 'theRootPassword', {
    dialect: 'postgres',
    port: '5432',
    host: '192.168.99.100'  // on mac use 'host.docker.internal'
    //host: 'host.docker.internal'
})

exports.users = sequelize.define('users', {
    username: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        primaryKey: false
    },
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: false,
        unique: true,
        autoIncrement: true
    },
    password: {
        type: Sequelize.STRING(100),
        allowNull: false
    }
}, { timestamps: false })

exports.playlists = sequelize.define('playlists', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true
    },
    playlist_name: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false
    },
    list_owner: {
        type: Sequelize.STRING(50),
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'users',
            key: 'username'
        }
    },
}, { timestamps: false })
exports.podinlist = sequelize.define('podinlist', {
    
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pod_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        unique: 'actions_unique',
        references: {
            model: 'podcasts',
            key: 'pod_id'
        }
    },
    playlist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        unique: 'actions_unique'
        /*references: {
        model: 'playlists',
        key: 'id'
        }*/
    }
}, { timestamps: false },{
    uniqueKeys: {
        actions_unique: {
            fields: ['pod_id', 'playlist_id']
        }
    } })


exports.podcasts = sequelize.define('podcasts', {
    pod_id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    pod_name: {
        type: Sequelize.STRING(300),
        primaryKey: false
    },
    pod_creators: {
        type: Sequelize.STRING(300),
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
        type: Sequelize.INTEGER,
        primaryKey: false
    }
}, { timestamps: false })


exports.reviews = sequelize.define('reviews', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    review_poster: {
        type: Sequelize.STRING(50),
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
        type: Sequelize.STRING(50),
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
        type: Sequelize.STRING(2000)
    }
}, { timestamps: false })

this.podinlist.belongsTo(this.playlists, { targetKey: 'id', foreignKey: 'playlist_id' })
this.playlists.hasMany(this.podinlist, { foreignKey: 'playlist_id' })

sequelize.sync().then(function () {
    console.log('DB connection sucessful.')
}, function (err) {
    console.log(err)
})
exports.sequelize
