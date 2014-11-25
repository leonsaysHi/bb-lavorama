// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
  
   baseUrl: 'scripts'

  ,paths: {

    // Map remaining vendor dependencies.
    'jquery': '../lib/jquery/dist/jquery'
    ,'underscore': '../lib/underscore/underscore'
    ,'backbone': '../lib/backbone/backbone'
    ,'swipeevent': '../lib/jquery-touchswipe/jquery.touchSwipe'

  },

  shim: {
    'backbone': {
      deps: ['jquery'],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    }
  }

});

require([
    'app'
	, 'router'
	, 'collections/items.coll'
  , 'views/swaper.view'
  , 'views/ui.view'
	], function(
     app
		,Router
		,ItemsCollection
    ,SwaperView
    ,UiView
	) {

	var itemsCollection = new ItemsCollection();
	itemsCollection.fetch({

		success : function(){

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
      var d = $('body').attr('data-id');swaperView.fillSwaper('next');
      if (d!='') swaperView.doSwap({date:d});
      else swaperView.doSwap({id:0});

	    // Define your master router on the application namespace and trigger all
	    // navigation from this instance.
	    app.router = new Router();

	    // Trigger the initial route and enable HTML5 History API support, set the
	    // root folder to '/' by default.  Change in app.js.
	    Backbone.history.start({ pushState: true, root: app.root });

		}

	});

});
