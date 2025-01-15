const express = require('express')

const { getAllUsers, getUserById, deleteUser, activateAndDeactivateUser} = require('../controller/userManagement')

const Router = express.Router()

Router.get('/admin/users', getAllUsers)
Router.get('/admin/users/:id', getUserById)
Router.delete('/admin/deleteuser/:id', deleteUser)
Router.patch('/admin/userstatus/:id', activateAndDeactivateUser)

module.exports = Router