/**
 * @项目名称: mock
 * @功能名称:
 * @文件名称: model
 * @Date: 2020/3/3
 * @Author: liux
 *
 */

let {Schema} = require('mongoose')
let {mongoClient} = require('../mongo')
const {apiModelName, userModelName} = require('../config')

const apiSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, ref: userModelName},
    url: {
      type: String, required: true, trim: true,
      validate: {
        validator: function (v) {
          return /^\/.+$/.test(v)
        },
        message: '{VALUE} is not a valid path!',
      },
    },
    weight: {
      type: Number,
      default: 0,
      min: [-10, 'rang -10 -- 10'],
      max: [10, 'rang -10 -- 10'],
    },
    data: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          var data = null
          try {
            data = JSON.parse(v)
          } catch (e) {

          }
          return data && typeof data === 'object'
        },
        message: '{VALUE} is not a valid JSON String!',
      },
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
)

apiSchema.index({userId: 1, url: 1}, {unique: true})
apiSchema.index({userId: 1, weight: -1, updated: -1})

module.exports = mongoClient.model(apiModelName, apiSchema)

