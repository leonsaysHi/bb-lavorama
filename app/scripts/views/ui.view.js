define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var uiView = Backbone.View.extend({
    
    initialize: function(){}
    
    ,events: {
      "click .swap": "clickSwap"
      ,"click .expand": "clickExpand"
      ,"click nav a": "clickDate"
    }
    
    ,render: function(){  
      var 
        tpl = $("#ui_tpl").html()  
        ,datas = {dates:this.collection.toJSON()}
        ,html = _.template(tpl)
      ;
      this.$el.append(html(datas));
      this.$nav = this.$el.find('nav');
      return this.$el;
    }

    ,clickSwap: function(ev){
      var $e = $(ev.currentTarget);

      if ($e.is('.disabled')) return;

      if ($e.is('.swapnext')) this.trigger('swap', {way:1});
      else this.trigger('swap', {way:-1});

    }

    ,clickExpand:function(ev){
      this.$nav.toggleClass('expanded', !(this.$nav.is('.expanded')));
    }
    
    ,clickDate:function(ev){
      ev.preventDefault();
      var $e = $(ev.currentTarget);
      this.trigger('swap', {date:$e.attr('data-date')});
      this.clickExpand(ev);
    }
    ,newItem:function(args){
      this.$el.find('.swapnext').toggleClass('disabled', (args.id==0));
      this.$el.find('.swapprev').toggleClass('disabled', (args.id==args.maxid));
    }

  });
  // Our module now returns our view
  return uiView;
});