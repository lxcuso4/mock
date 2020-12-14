/**
 * @功能名称:
 * @文件名称: user.js
 * @Date: 2020-03-16 16:35.
 * @Author: liux
 * @Copyright（C）: liux   All rights reserved.
 */

let {Schema} = require('mongoose');
let {mongoClient} = require('../mongo');
const {userModelName} = require('../config');

const userChema = new Schema({
      user: {type: String,  unique: true, index: true, trim: true,
        default: 'default',
        validate: {
          validator: function (v) {
            return /^\w+$/.test(v);
          },
          message: '{VALUE} is not a valid String!'
        }
      },
      proxy: {
        host: {type: String, trim: true, default: 'default'},
        port: {type: Number, default: 80},
        cache: {type: Boolean, default: false},
        start: {type: Boolean, default: false},
      },
    },
    {
      timestamps: {createdAt: 'created', updatedAt: 'updated'},
      toObject: {
        transform: function (doc, ret, options) {
          ret.id = ret._id
          delete ret.__v
          delete ret._id
          return ret
        },
      },
      toJSON: {
        transform: function (doc, ret, options) {
          ret.id = ret._id
          delete ret._id
          delete ret.__v
          return ret
        },
      },
    },
);

module.exports = mongoClient.model(userModelName, userChema);

