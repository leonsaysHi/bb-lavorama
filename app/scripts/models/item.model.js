define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var itemModel = Backbone.Model.extend({

    defaults: {
      name: "0000_00_00"
      ,date: "0000_00_00"
      ,raw: "00000000"
      ,y: 0
      ,m: 0
      ,d: 0
    },

    initialize: function() { 
      var a = this.get('date').split('_');
      this.set('y', parseInt(a[0]));
      this.set('m', parseInt(a[1]));
      this.set('d', parseInt(a[2]));
      this.set('raw', parseInt( a[0].toString() + a[1].toString() + a[2].toString() ) );
    }

  });
  // Return the model for the module
  return itemModel;
});