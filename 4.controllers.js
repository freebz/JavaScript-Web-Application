// Module Pattern
(function(){
  /*...*/
})();

// Global Import
(function($){
  /*...*/
})(jQuery);

// Global Export
(function($, exports){
  exports.Foo = "wem";
})(jQuery, window);

assertEqual( Foo, "wem" );

// Adding a Bit of Context
(function(){
  assertEqual( this, window );
})();

(function(){
  var mod = {};

  mod.contextFunction = function(){
    assertEqual( this, mod );
  };

  mod.contextFunction();
})();


(function($){

  var mod = {};

  mod.load = function(func){
    $($.proxy(func, this));
  };

  mod.load(function(){
    this.view = $("#view");
  });

  mod.assetsClick = function(e){
    // Process click
  };

  mod.load(function(){
    this.view.find(".assets").click(
      $.proxy(this.assetsClick, this)
    );
  });
})(jQuery);

// Abstracting into a Library
(function($, exports){
  var mod = function(includes){
    if (includes) this.include(includes);
  };
  mod.fn = mod.prototype;

  mod.fn.proxy = function(func){
    return $.proxy(func, this);
  };

  mod.fn.load = function(func){
    $(this.proxy(func));
  };

  mod.fn.include = function(ob){
    $.extend(this, ob);
  };

  exports.Controller = mod;
})(jQuery, window);

(function($, Controller){
  
  var mod = new Controller;

  mod.toggleClass = function(e){
    this.view.toggleClass("over", e.data);
  };

  mod.load(function(){
    this.view = $("#view");
    this.view.mouseover(this.proxy(this.toggleClass), true);
    this.view.mouseout(this.proxy(this.toggleClass), false);
  });

})(jQuery, Controller);

Controller.fn.unload = function(func){
  jQuery(window).bind("unload", this.proxy(func));
};

var mod = new Controller;
mod.include(StateMachine);


// Loading Controllers After the Document

// Use global context, rather than the window
// object, to create global variables
var exports = this;

(function($){
  var mod = {};

  mod.create = function(includes){
    var result = function(){
      this.init.apply(this, arguments);
    };

    result.fn = result.prototype;
    result.fn.init = function(){};

    result.proxy = function(func) { return $.proxy(func, this); };
    result.fn.proxy = result.proxy;

    result.include = function(ob){ $.extend(this.fn, ob); };
    result.extend  = function(ob){ $.extend(this, ob); };
    if (includes) result.include(includes);
    
    return result;
  };

  exports.Controller = mod;
})(jQuery);

jQuery(function($){
  var ToggleView = Controller.create({
    init: function(view){
      this.view = $(view);
      this.view.mouseover(this.proxy(this.toggleClass), true);
      this.view.mouseout(this.proxy(this.toggleClass), false);
    },

    //this.toggleClass: function(e){
    toggleClass: function(e){
      this.view.toggleClass("over", e.data);
    }
  });

  // Instantiate controller, calling init()
  new ToggleView("#view");
});



// Accessing View
var exports = this;

jQuery(function($){
  exports.SearchView = Controller.create({
    // Map of selectors to local variable names
    elements: {
      "input[type=search]": "searchInput",
      "form": "searchForm"
    },

    // Called upon instantiation
    init: function(element){
      this.el = $(element);
      this.refreshElements();
      this.searchForm.submit(this.proxy(this.search));
    },

    search: function(){
      console.log("Searching:", this.searchInput.val());
    },

    // Private

    $: function(selector){
      // An `el` property is required, and scopes the query
      return $(selector, this.el);
    },

    // Set up the local variables
    refreshElements: function(){
      for (var key in this.elements) {
        this[this.elements[key]] = this.$(key);
      }
    }
  });

  new SearchView("#users");
});



// Delegating Events

var exports = this;

jQuery(function($){
  exports.SearchView = Controller.create({
    // Map all the event names,
    // selectors, and callbacks
    events: {
      "submit form": "search"
    },

    init: function(){
      // ...
      this.delegateEvents();
    },

    search: function(e){ /* ... */ },

    // Private

    // Split on the first space
    eventSplitter: /^(\w+)\s*(.*)$/,

    delegateEvents: function(){
      for (var key in this.events) {
        var methodName = this.events[key];
        var method = this.proxy(this[methodName]);

        var match = key.match(this.eventSplitter);
        var eventName = match[1], selector = match[2];

        if (selector === '') {
          this.el.bind(eventName, method);
        } else {
          this.el.delegate(selector, eventName, method);
        }
      }
    }
  });
});



// finished_controller

var exports = this;

jQuery(function($){
  exports.SearchView = Controller.create({
    elements: {
      "input[type=search]": "searchInput",
      "form": "searchForm"
    },

    events: {
      "submit form": "search"
    },

    init: function(){ /* ... */ },
    
    search: function(){
      alert("Searching: " + this.searchInput.val());
      return false;
    },
  });

  new SearchView({el: "#users"});
});


// State Machines

var Events = {
  bind: function(){
    if ( !this.o ) this.o = $({});
    this.o.bind.apply(this.o, arguments);
  },

  trigger: function(){
    if ( !this.o ) this.o = $({});
    this.o.trigger.apply(this.o, arguments);
  }
};

var StateMachine = function(){};
StateMachine.fn = StateMachine.prototype;

// Add event binding/triggering
$.extend(StateMachine.fn, Events);

StateMachine.fn.add = function(controller){
  this.bind("change", function(e, current){
    if (controller == current)
      controller.activate();
    else
      controller.deactivate();
  });

  controller.active = $.proxy(function(){
    this.trigger("change", controller);
  }, this);
};

var con1 = {
  activate: function() { /* ... */ },
  deactivate: function() { /* ... */ }
};

var con2 = {
  activate: function() { /* ... */ },
  deactivate: function() { /* ... */ }
};

// Create a new StateMachine and add states
var sm = new StateMachine;
sm.add(con1);
sm.add(con2);

// Activate first state
con1.active();

sm.trigger("change", con2);


var con1 = {
  activate: function(){
    $("#con1").addClass("active");
  },
  deactivate: function(){
    $("#con1").removeClass("active");
  }
};

var con2 = {
  activate: function(){
    $("#con2").addClass("active");
  },
  deactivate: function(){
    $("#con2").removeClass("active");
  }
};

/* style
#con1, #con2 { display: none; }
#con1.active, #con2.active { display: block; }
*/





// Routing
// Using the URL's Hash

// Set the hash
window.location.hash = "foo";
assertEqual( window.location.hash , "#foo" );

// String "#"
var hashValue = window.location.hash.slice(1);
assertEqual( hashValue, "foo" );


// Detecting Hash Changes
window.addEventListener("hashchange", function(){ /* ... */ }, false);

$(window).bind("hashchange", function(event){
  // hash changed, change state
});

jQuery(function(){
  var hashValue = location.hash.slice(1);
  if (hashValue)
    $(window).trigger("hashchange");
});



// Ajax Crawling


// Using the HTML5 History API
// The data object is arbitary and is passed with the popstate event
var dataObject = {
  createdAt: '2011-10-10',
  author:    'donnamoss'
};

var url = '/posts/new-url';
//history.pushState(dataObject, document.title, url);


window.addEventListener("popstate", function(event){
  if (event.state){
    // history.pushState() was called
  }
});

$(window).bind("popstate", function(event){
  event = event.originalEvent;
  if (event.state) {
    // history.pushState() was called
  }
});

