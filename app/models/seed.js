// seed.js will be run by the script `npm run seed`

// this will seed our databse with a buncha wrestlers

// we can modify this later after building out our API a little bit.

const mongoose = require('mongoose')
const Wrestler = require('./wrestler')
const db = require('../../config/db')

const startWrestlers = [
    { name: 'Stone Cold Steve Austin', weight: 252, active: false},
    { name: 'The Undertaker', weight: 309, active: false},
    { name: 'Rey Mysterio', weight: 175, active: true},
    { name: 'Edge', weight: 240, active: true},
    { name: 'John Cena', weight: 251, active: false},
    { name: 'Brock Lesnar', weight: 287, active: true}
]

// first we connect to the db
// then remove all wrestlers
// then add the start wrestlers
// and always close the connection, whether its a success or failure

mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        Wrestler.deleteMany()
            .then(deletedWrestlers => {
                console.log('the deleted wrestlers:', deletedWrestlers)
                // now we add our wrestlers to the db
                Wrestler.create(startWrestlers)
                    .then(newWrestlers => {
                        console.log('the new wrestlers', newWrestlers)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log(error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })