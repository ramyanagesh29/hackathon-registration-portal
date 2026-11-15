
const mongoose = require('mongoose')

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  { _id: false }
)

const hackathonRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    mobile: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },

    college: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    domain: {
      type: String,
      required: true,
    },

    projectName: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    pptLink: {
      type: String,
      required: true,
    },

    prototypeLink: {
      type: String,
      required: true,
    },

    demoVideoLink: {
      type: String,
      default: '',
    },

    teamSize: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    teamMembers: {
      type: [teamMemberSchema],
      default: [],
      validate: {
        validator: function (members) {
          const expected = this.teamSize === 1 ? 0 : this.teamSize
          return members.length === expected
        },
        message: 'Team member count does not match team size.',
      },
    },

    registrationStatus: {
      type: String,
      enum: ['Submitted'],
      default: 'Submitted',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model(
  'HackathonRegistration',
  hackathonRegistrationSchema
)
