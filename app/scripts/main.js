// Break out the application running from the configuration definition to
// assist with testing.
require(["config"], function() {
  // Kick off the application.
  require([
  	  "app"
  	, "router"
  	, "collections/items.coll"
  	], function(
  		app
  		,Router
  		,ItemsCollection
  	) {

  	var itemsCollection = new ItemsCollection();
  	itemsCollection.fetch({

  		success : function(){

  			require(['views/swaper.view', 'views/ui.view'], function (SwaperView, UiView) {

  				var swaperView = new SwaperView({el:'#swaper', collection:itemsCollection});
          swaperView.render();

          var ui = new UiView({el:'#ui', collection:itemsCollection});
          ui.render();

          swaperView.on('newItem', ui.newItem, ui);
          ui.on('swap', swaperView.doSwap, swaperView);

          // resize
          $(window).on('resize', function(){
            swaperView.onResizeWindow();
          });

          // first page
          var d = $('body').attr('data-id');
          if (d!='') swaperView.doSwap({date:d});
          else swaperView.doSwap({id:0});

  			});

		    // Define your master router on the application namespace and trigger all
		    // navigation from this instance.
		    app.router = new Router();

		    // Trigger the initial route and enable HTML5 History API support, set the
		    // root folder to '/' by default.  Change in app.js.
		    Backbone.history.start({ pushState: true, root: app.root });

  		}

  	});

  });
});
