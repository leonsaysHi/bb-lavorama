define([
  'jquery',
  'underscore',
  'backbone',
  'collections/imgs.coll',
  'views/img.view'
], function($, _, Backbone, ImgsCollection, ImgView){
  var itemView = Backbone.View.extend({
    
    initialize: function(){
      this.name = this.model.get('name');
      this.date = this.model.get('date');
      this.JSONloaded = false;
      this.isShown = false;
      this.imgs = [];
      this.h = 0;
    }
    
    ,render: function(){
      var that = this;
      //
      var 
        tpl = $("#item_tpl").html()  
        ,datas = {name:this.name}
        ,html = _.template(tpl)
      ;
      this.$el = $(html(datas));
      //
      this.collection = new ImgsCollection();
      this.collection.fetch({ 

        data: $.param({ d: that.date })

        ,success : function(){
          that.renderImgs();
          that.JSONloaded = true;          
          that.h = that.$el.height();
          that.trigger('ready');
          if (that.isShown) that.doShow();
        }

      });
      return this.$el;
    }

    ,doShow: function() {
      var that = this;
      this.isShown = true;
      if (that.JSONloaded) {
        _.each(
          this.imgs
          ,function(img, index, list){
            img.doShow();
          }
          ,this
        );
      }
    }

    ,doHide: function() {
      this.isShown = false;
      _.each(
        this.imgs
        ,function(element, index, list){
          element.doHide();
        }
        ,this
      );
    }

    ,renderImgs: function() {
      var that = this,i;
      this.collection.each(function(model){
        i = new ImgView({model:model});
        that.$el.append(i.render());
        that.imgs.push(i);
      });
    }

  });
  // Our module now returns our view
  return itemView;
});