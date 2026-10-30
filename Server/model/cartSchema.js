// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//     user:{
//         ref:"User",
//         type:mongoose.Schema.Types.ObjectId,
//         required:true
//     },
//     items:[{
//         product:{
//             ref:"Product",
//             type:mongoose.Schema.Types.ObjectId,
//             required:true
//         },
//         quantity:{
//             type:Number,
//             required:true,
//             default:1
//         }
//     }]
// },{
//     timestamps:true

// });

// const Cart = mongoose.model('Cart',cartSchema);
// module.exports = Cart;


const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
