define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var imgModel = Backbone.Model.extend({
    defaults: {
      src: "#"
    }
  });
  // Return the model for the module
  return imgModel;
});