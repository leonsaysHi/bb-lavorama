// Filename: collections/projects
define([
  'underscore',
  'backbone',
  // Pull in the Model module from above
  'models/item.model'
], function(_, Backbone, ItemModel){
  var itemsCollection = Backbone.Collection.extend({

    model: ItemModel
    ,url: 'http://www.lavorama.net/api/menu.json.php'
    ,comparator : function(item) { return -item.get("raw"); }



    ,parse: function(response){
    	return response;
    }

  });
  // You don't usually return a collection instantiated
  return itemsCollection;
});