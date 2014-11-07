// Filename: collections/projects
define([
  'underscore',
  'backbone',
  // Pull in the Model module from above
  'models/img.model'
], function(_, Backbone, ImgModel){
  var imgsCollection = Backbone.Collection.extend({

    model: ImgModel
    ,url: 'http://www.lavorama.net/api/images.json.php'
    ,comparator : 'name'



    ,parse: function(response){
    	return response;
    }

  });
  // You don't usually return a collection instantiated
  return imgsCollection;
});