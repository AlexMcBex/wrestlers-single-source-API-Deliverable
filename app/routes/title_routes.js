const express = require('express')
const passport = require('passport')

const Wrestler = require('../models/wrestler')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()


//POST - create
router.post('/titles/:wrestlerId', removeBlanks, (req, res, next)=>{
    const title = req.body.title
    const wrestlerId = req.params.wrestlerId

    Wrestler.findById(wrestlerId)
    .then(handle404)
    .then(wrestler =>{
        console.log('the wrestler: ', wrestler)
        console.log('the title: ', title)
        wrestler.titles.push(title)
        return wrestler.save()
    })
    .then(wrestler => res.status(201).json({wrestler: wrestler}))
    .catch(next)
})

//PATCH - update
router.patch('/titles/:wrestlerId/:titleId', requireToken, removeBlanks, (req, res, next)=>{
    const wrestlerId = req.params.wrestlerId
    const titleId = req.params.titleId

    Wrestler.findById(wrestlerId)
    .then(handle404)
    .then(wrestler =>{
        const theTitle = wrestler.titles.id(titleId)
        requireOwnership(req, wrestler)
        theTitle.set(req.body.title)
        return wrestler.save()
    })
    .then(()=>res.sendStatus(204))
    .catch(next)
})

//DELETE - destroy
router.delete('/titles/:wrestlerId/:titleId', requireToken, (req, res, next) => {
    const wrestlerId = req.params.wrestlerId
    const titleId = req.params.titleId

    Wrestler.findById(wrestlerId)
        .then(handle404)
        .then(wrestler => {
            const theTitle = wrestler.titles.id(titleId)
            requireOwnership(req, wrestler)
            theTitle.remove()
            return wrestler.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

module.exports = router