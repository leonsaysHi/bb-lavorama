// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
   baseUrl: "scripts"
  ,paths: {

    // Map remaining vendor dependencies.
    "jquery": "../lib/jquery/dist/jquery"
    ,"underscore": "../lib/underscore/underscore"
    ,"backbone": "../lib/backbone/backbone"
    ,"swipeevent": "../lib/jquery-touchswipe/jquery.touchSwipe"

  },

  shim: {
    // This is required to ensure Backbone works as expected within the AMD
    // environment.
    "backbone": {
      // These are the two hard dependencies that will be loaded first.
      deps: ["jquery"],
      // This maps the global `Backbone` object to `require("backbone")`.
      exports: "Backbone"
    },
    "underscore": {
      exports: "_"
    }
  }
});
