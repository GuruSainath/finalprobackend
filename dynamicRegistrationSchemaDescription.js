// require mongoose
var mongoose = require('mongoose');

var descriptionschema = mongoose.Schema({
  // storing the data according to considering the single user
  key: {
    type: String,
    required: true
  },
  // user form data will be stored in this values and for single user number of forms can in stored here
  values:[{
    // user / creator naem
    creatorName: {
      type: String,
      required: true
    },
    // form name
    formName: {
      type: String,
      required: true
    },
    // form description
    formDescription: {
      type: String,
      required: true
    },
    // form generating date
    formgeneratedDate: {
      type: String,
      required: true
    },
    // creating of a form data
    formgeneratedData: [{
      _id: {
        type: String,
        required: true
      },
      text: [{
        _id: {
          type: String,
          required: true
        }
      }],
      textarea: [{
        _id: {
          type: String,
          required: true
        }
      }],
      button: [{
        _id: {
          type: String,
          required: true
        }
      }],
      checkbox: [{
        _id: {
          type: String,
          required: true
        }
      }],
      select: [{
        _id: {
          type: String,
          required: true
        }
      }]
    }]
  }]
});

// creating a model to the schema
var descriptionmodel = module.exports = mongoose.model('descriptionmodel', descriptionschema);

// finding the userform already exists in the datbase or Not
module.exports.findCreatorNameData = function(data, callback) {
  descriptionmodel.findOne({creatorName : data.creatorName}, callback);
}

// updating/creating description data in  to the table
module.exports.createData = function(data, callback) {
  descriptionmodel.create(data, callback);
}
