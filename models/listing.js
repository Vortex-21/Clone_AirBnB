const mongoose = require("mongoose");
const Review = require("./reviews.js");
const User = require("./user.js")
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type:String,
        // required:true

    },
    image: {
        // type: String,
        // default: "https://images.unsplash.com/photo-1592743263126-bb241ee76ac7?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set: (v)=>v===""?"https://images.unsplash.com/photo-1592743263126-bb241ee76ac7?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
        url:String,
        filename:String,
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        // required:true
    },
    country: {
        type: String,
        // required: true
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            // required: true
        },
        coordinates:{
            type:[Number],
            // required:true
        }
    }
});
listingSchema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
