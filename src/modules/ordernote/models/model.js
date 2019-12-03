'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var OrdernoteSchema = new Schema({
    // name: {
    //     type: String,
    //     required: 'Please fill a Ordernote name',
    // },
    author:{
        type: String
    },
    note:{
        type: String
    },
    customer_note:{
        type: Boolean
    },
    added_by_user:{
        type: Boolean
    },



    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Ordernote", OrdernoteSchema);