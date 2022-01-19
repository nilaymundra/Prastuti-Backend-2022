const mongoose = require('mongoose');
const slugify = require('slugify');

const userModel = require('./Users');
const requestModel = require('./Requests');
const eventModel = require('./Events');

const TeamSchema = new mongoose.Schema({
    Team_Name : {
        type : String,
        unique : [true, 'This Team Name is not available'],
        required : true
    },
    slug: String,
    Events : [{
        type: mongoose.Schema.Types.ObjectId
    }],
    Members : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    Member_Count : {
        type : Number,
        required : true,
        max : [3, 'Max members allowed is 3']
    },
    Pending_Requests : [{
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'request'
    }]
})

TeamSchema.pre('save', function(next) {
    this.slug = slugify(this.Team_Name, {
        lower: true
    });
    next();
})

TeamSchema.pre(/^find/, async function(next) {
    this.populate({
        path: 'Members',
        select: '-Teams -Pending_Requests -__v -Events_Participated -Phone -Total_Score'
    })
    this.populate({
        path: 'Pending_Requests',
        select: '-For_Team'
    })
    next();
})

const Team = mongoose.model('team', TeamSchema);
module.exports = Team;