define([
  'jquery',
  'underscore',
  'backbone',
  'swipeevent',
  'views/item.view'
], function($, _, Backbone, SwipeEvent, ItemView){
  var swaperView = Backbone.View.extend({
    
    initialize: function(){
      this._currid = -1; 
      this.$curritem = null;
      this.$previtem = null;
      this.$nextitem = null;
      this.resizing = false;
    }
    
    ,events: {
      //"swipeLeft [data-pos=curr]" : "swipeIt"
    }

    ,swipeIt: function(direction){
      if (direction == 'right' && this._currid<this.collection.length-1) {
          this.doSwap({way:-1});
      }
      else if (direction == 'left' && this._currid>0) {
          this.doSwap({way:1});
      }
    }
    
    ,render: function(){
      var that = this;
      this.updateSwaperWidth();
      this.$el.swipe( {
        swipeLeft:function(event, direction, distance, duration, fingerCount) {
          that.swipeIt(direction); 
        },
        swipeRight:function(event, direction, distance, duration, fingerCount) {
          that.swipeIt(direction); 
        }
      });
    }

    ,onResizeWindow: function(){
      this.resizing = true;
      this.updateSwaperWidth();
      this.updateSwaperContainers();
      this.resizing = false;
    }

    ,updateSwaperWidth: function(){      
      var
        that = this
        ,ww = $('body').width()
        ,ww_bp,itemw
      ;

      if(ww>810) {
        itemw = 753;
        ww_bp = 950;
      }
      else if(ww>610) {
        itemw = 603;
        ww_bp = 810;
        resized = true;
      }
      else if(ww>410) {     
        itemw = 403;
        ww_bp = 610;
        resized = true;
      }
      else {     
        itemw = 333;
        ww_bp = 410;
        resized = true;
      }

      var 
        v = 50
        ,prevout = -itemw - v
        ,nextout = ww + v
        ,prev = (ww>=ww_bp) ? -itemw + v : -itemw
        ,curr = (ww-itemw)*.5
        ,next = (ww>=ww_bp) ? ww - v : ww
        ,iswide = (ww>=ww_bp)
      ;
      this.coo = {
         prevout : prevout
        ,nextout : nextout
        ,prev : prev
        ,curr : curr
        ,next : next
        ,iswide : iswide
      };
      
    }

    ,updateSwaperContainers: function(){
      // position
      this.positionSwaperContainers();
    }

    ,positionSwaperContainers: function(){
      var that = this, ci = this.$curritem, ci_h = ci.$el.outerHeight();
      if (!_.isNull(ci)) {
        if (ci.h>0) {
          if (this.resizing) { 
            this.$el.height(ci_h);
          }
          else {
            this.$el.height(ci_h);
          }
        }
        else {
          this.$curritem.on('ready', function(){
            that.$el.height(ci_h);
          });
        }
      }
      this.$el.find('[data-pos=prev]').css('left', this.coo.prev + 'px');
      this.$el.find('[data-pos=curr]').css('left', this.coo.curr + 'px');
      this.$el.find('[data-pos=next]').css('left', this.coo.next + 'px');
      $('html, body').animate({scrollTop: 0}, 200);
    }
    
    ,fillSwaper: function(comingfrom){
      var that = this, c = this.collection, _x;
      
      // add previous item
      if (_.isNull(this.$previtem) && typeof c.at(this._currid+1) !== 'undefined') {
        _x = this.coo.prev;
        if (!_.isNull(comingfrom)) {
          if (comingfrom=='prev') { _x = this.coo.nextout; }
        }
        this.$previtem = new ItemView({model:c.at(this._currid+1)});
        this.$el.append(
          this.$previtem
            .render()
            .attr('data-pos', 'prev')
            .css('left', _x + 'px')
        );
      }

      // add current item
      if (_.isNull(this.$curritem) && typeof c.at(this._currid) !== 'undefined') {
        _x = this.coo.prev;
        if (!_.isNull(comingfrom)) {
          if (comingfrom=='prev') { _x = this.coo.nextout; }
        }
        this.$curritem = new ItemView({model:c.at(this._currid)});
        this.$el.append(this.$curritem.render().attr('data-pos', 'curr').css('left', _x + 'px'));
      }

      // add next item
      if (_.isNull(this.$nextitem) && typeof c.at(this._currid-1) !== 'undefined') {
        _x = this.coo.next;
        if (!_.isNull(comingfrom)) {
          if (comingfrom=='next') { _x = this.coo.prevout; }
        }
        this.$nextitem = new ItemView({model:c.at(this._currid-1)});
        this.$el.append(this.$nextitem.render().attr('data-pos', 'next').css('left', _x + 'px'));
      }

      if (!_.isNull(this.$curritem)) { 
        Backbone.history.navigate('/' + this.$curritem.model.get('date'), true);
      }
    }

    ,setItemShown: function($item, shown){
      if(_.isNull(shown)) { shown = true; }
      if (!_.isNull($item)) {
        if(shown === true) {
          $item.doShow();
        }
        else {
          $item.doHide();
          $item.off('ready');
        }
      }
    }

    ,removeItem: function($e, way){
      var x = (way=='prev' ? this.coo.prevout : this.coo.nextout)*1.5;
      $e
        .removeAttr('data-pos')
        .removeAttr('data-pos')
        .css({left:x+'px'})
      ;
      setTimeout(function() {
        $e.remove();
      }, 500);
    }
    
    ,doSwap: function(args){

      var self = this;

      if (typeof args.way !== 'undefined') {

        this.setItemShown(this.$curritem, false);

        if (args.way>0) {

          if (!_.isNull(this.$previtem)) { this.removeItem(this.$previtem.$el, 'prev'); }

          this.$previtem = this.$curritem;
          this.$curritem = this.$nextitem;
          this.$nextitem = null;

          this._currid--;
        }

        else if (args.way<0) {

          if (!_.isNull(this.$nextitem)) { this.removeItem(this.$nextitem.$el, 'next'); }
          
          this.$nextitem = this.$curritem;
          this.$curritem = this.$previtem;
          this.$previtem = null;        

          this._currid++;
        }

        console.log(this.coo);
        if (!_.isNull(this.$previtem)) {
          this.$previtem.$el.attr('data-pos', 'prev').animate({left: this.coo.prev}, 400);
        }
        if (!_.isNull(this.$curritem)) {
          this.$curritem.$el.attr('data-pos', 'curr').animate(
            {left: this.coo.curr},
            400,
            function(){ self.setItemShown(self.$curritem, true); }
          );
        }
        if (!_.isNull(this.$nextitem)) {
          this.$nextitem.$el.attr('data-pos', 'next').animate({left: this.coo.next}, 400);
        }

        this.fillSwaper(null);

      }


      else if (typeof args.date !== 'undefined' || typeof args.id !== 'undefined') {

        var i;
        if(typeof args.date !== 'undefined') {
          var m = this.collection.findWhere({date:args.date});
          i = (typeof m !== 'undefined') ? this.collection.indexOf(m) : 0; 
        }
        else {
          i = args.id;
        }

        if (i==this._currid)  { return; }
        if (i==this._currid+1)  {
          this.doSwap({way:-1});
          return;
        }
        if (i==this._currid-1)  {
          this.doSwap({way:+1});
          return;
        }

        var removeway = i<this._currid ? 'prev' : 'next';

        if (!_.isNull(this.$previtem)) { this.removeItem(this.$previtem.$el, removeway); }        
        if (!_.isNull(this.$nextitem)) { this.removeItem(this.$nextitem.$el, removeway); }        
        if (!_.isNull(this.$curritem)) { this.removeItem(this.$curritem.$el, removeway); }
        
        this.$nextitem = null;
        this.$curritem = null;
        this.$previtem = null;

        this._currid = i;

        var that = this;
        setTimeout( 
          function(){
            that.fillSwaper(removeway);
            that.setItemShown(that.$curritem, true);
          }
          ,500
        );

      }

      this.trigger('newItem', {id:this._currid, maxid:(this.collection.length-1)});

    }

  });
  // Our module now returns our view
  return swaperView;
});