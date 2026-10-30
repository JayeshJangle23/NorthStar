// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
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
//     }],
    
// shippingAddress: {
//   fullName: {
//     type: String,
//     required: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   addressLine: {
//     type: String,
//     required: true,
//   },
//   city: {
//     type: String,
//     required: true,
//   },
//   state: {
//     type: String,
//     required: true,
//   },
//   postalCode: {
//     type: String,
//     required: true,
//   },
//   country: {
//     type: String,
//     required: true,
//   },
// },

//     totalAmount:{
//         type:Number,
//         required:true
//     },
//     paymentStatus:{
//         type:String,
//         enum:['pending','completed','failed'],
//         default:'pending'
//     },
//     paymentMethod:{
//         type:String,
//         enum:['COD','Online'],
//         default:'COD'
//     },
//     orderStatus:{
//         type:String,
//         enum:['processing','shipped','delivered','cancelled'],
//         default:'processing'
//     }
// },{
//     timestamps: true
// })

// const Order = mongoose.model('Order',orderSchema);
// module.exports = Order;

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        image: {
          type: String,
          default: "",
        },
      },
    ],

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      addressLine: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },

    status: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;