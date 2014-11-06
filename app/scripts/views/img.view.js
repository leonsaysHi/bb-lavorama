define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var imgView = Backbone.View.extend({
    
    initialize: function(){
    }
    
    ,render: function(){
      var 
        tpl = $("#img_tpl").html()  
        ,datas = {src:this.src}
        ,html = _.template(tpl)
      ;      
      this.$el = $(html(datas));

      return this.$el;
    }

    ,doShow: function(){
      if (this.$el.find('img[src]').length==0) {this.doLoad();}
      else this.$el.find('div').css('opacity', 0);
    }

    ,doHide: function(){
      this.$el.find('div').css('opacity', 1);
    }

    ,doLoad: function(){
      var that = this, $img = this.$el.find('img');
      $img.on('load', function(){that.isLoaded()});
      this.$el.find('img').attr('src', this.model.get('src'));
    }

    ,isLoaded: function() {
      this.doShow();
    }
    

  });
  // Our module now returns our view
  return imgView;
});