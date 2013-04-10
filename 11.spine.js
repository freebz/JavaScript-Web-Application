// assert

var assert = function(value, msg){
  if ( !value )
    throw(msg || (value + " does not equal true"));
};

var assertEqual = function(val1, val2, msg){
  if (val1 !== val2)
    throw(msg || (val1 + " does not equal " + val2));
};




// Classes

var User = Spine.Class.create({
  name: "Caroline"
});

var Friend = User.create();

assertEqual( Friend.prototype.name, "Caroline");




// Instantiation

//var user = User.init();
var user = new User();
assertEqual( user.name, "Caroline" );

user.name = "Trish";
assertEqual( user.name, "Trish" );



var User = Spine.Class.create({
  init: function(name) {
    this.name = name;
  }
});

//var user = User.init("Martina");
var user = new User("Martina");
assertEqual( user.name, "Martina" );






// Extending Classes

User.include({
  // Instance properties
});

User.extend({
  // Class properties
});


var ORM = {
  extended: function() {
    // invoked when extended
    // this === User
  },
  find:  function(){ /* ... */ },
  first: function(){ /* ... */ }
};

User.extend( ORM );



var Friend = User.create();

User.include({
  email: "info@eribium.org"
});

//assertEqual( Friend.init().email, "info@eribium.org" );
assertEqual( new Friend().email, "info@eribium.org" );




// We want the records array to be specific to the class
var User = Spine.Class.create({
  // Called on instantiation
  init: function() {
    this.attributes = {};
  }
}, {
  // Called when the class is created
  created: function() {
    this.records = [];
  }
});





// Models

// Create the Task model.
var Task = Spine.Model.setup("Task", ["name", "done"]);


Task.extend({
  done: function(){ /* ... */ }
});

Task.include({
  name: "Empty...",
  done: false,

  toggle: function(){
    this.done = !this.done;
  }
});




//var task = Task.init({name: "Walk the dog"});
var task = new Task({name: "Walk the dog"});
assertEqual( task.name, "Walk the dog" );



var task = new Task();
task.name = "Read the paper";
//assertEqual( task.attributes(), {name: "Read the paper"} );
assertEqual( task.name, "Read the paper" );




var task = new Task({name: "Finish book"});
task.save();



var task = Task.find("c-2");
assertEqual( task.name, "Finish book" );



var taskExists = Task.exists("c-2");
assert( taskExists );


var task = Task.create({name: "Thanks for all the fish"});

assert( task.exists() );
task.destroy();
assertEqual( task.exists(), false );




// Fetching Records

// Return all tasks
Task.all();


// Return all tasks with a false done attribute
var pending = Task.select(function(task){ return !task.done });


// Invoke a callback for each task
Task.each(function(task){ /* ... */ });


// Finds first task with the specified attribute value
//Task.findByAttribute(name, value);

// Finds all tasks with the specified attribute value
//Task.findAllByAttribute(name, value);




// Model Events

Task.bind("save", function(record){
  console.log(record.name, "was saved!");
});


Task.first().bind("save", function(){
  console.log(this.name, "was saved!")
});

Task.first().updateAttributes({name: "Tea with the Queen"});





// Validation

Task.include({
  validate: function(){
    if ( !this.name ) return "Name required";
  }
});

Task.bind("error", function(record, msg){
  // Very basic error notification
  alert("Task didn't save: " + msg);
});



// Persistence

// Save with local storage
// Spine.Model 클래스가 없음
//Task.extend(Spine.Model.Local);
Task.fetch();


Task.bind("refresh", function(){
  // New tasks!
  renderTemplate(Task.all());
});



// Save to server
//Task.extend(Spine.Model.Ajax);

// Add a custom URL
Task.extend({
  url: "/tasks"
});

// Fetch new tasks from the server
Task.fetch();




// Controllers

jQuery(function(){
  window.Tasks = Spine.Controller.create({
    // Controller properties
  });
});


//var tasks = new Tasks();
var tasks = new Tasks({el: $("#tasks")});
assertEqual( tasks.el.attr("id"), "tasks");


window.Tasks = Spine.Controller.create({
  init: function(){
    this.el.html("Some rendered text");
  }
});


var tasks = new Tasks();
$("body").append(tasks.el);


var tasks = new Task({time: Task.first()});
assertEqual( Task.first(), tasks.item );



// Proxying

// Equivalent to suing proxyAll
var Tasks = Spine.Controller.create({
  proxied: ["render", "addAll"],

  render: function(){ /* ... */ },
  addAll: function(){ /* ... */ }
});





// Elements

// The `input` instance variable
var Tasks = Spine.Controller.create({
  elements: {
    "form input[type=text]": "input"
  },

  init: function(){
    // this.input refers to the form's input
    console.log( this.input.val() );
  }
});



// Delegating Events
var Tasks = Spine.Controller.create({
  events: {
    "keydown form input[type=text]": "keydown"
  },

  keydown: function(e){ /* ... */ }
});



// Controller Events

var Sidebar = Spine.Controller.create({
  events: {
    "click [data-name]": this.click
  },

  init: function(){
    this.bind("change", this.change);
  },

  change: function(name){},

  click: function(e){
    this.trigger("change", $(e.target).attr("data-name"));
  }

});




// Global Events

var Sidebar = Spine.Controller.create({
  proxied: ["change"],

  init: function(){
    this.App.bind("change", this.change);
  },
  change: function(name){}
});





// The Render Pattern

var Tasks = Spine.Controller.create({
  init: function(){
    Task.bind("refresh change", this.proxy(this.render));
  },

  template: function(items){
    return($("#tasksTemplate").tmpl(items));
  },

  render: function(){
    this.el.html(this.template(Task.all()));
  }
});




// The Element Pattern

var TasksItem = Spine.Controler.create({
  // Delegate the click event to a local handler
  events: {
    "click": "click"
  },

  // Ensure functions have the correct context
  proxied: ["render", "remove"],

  // Bind events to the record
  init: function(){
    this.item.bind("update", this.render);
    this.item.bind("destroy", this.remove);
  },

  // Render an element
  render: function(item){
    if (item) this.item = item;

    this.el.html(this.template(this.item));
    return this;
  },

  // Use a template, in this case via jQuery.tepl.js
  template: function(items){
    return($("#tasksTemplate").tmpl(items));
  },

  // Called after an element is destroyed
  remove: function(){
    this.el.remove();
  },

  // We have fine control over events, and
  // easy access to the record too
  click: function(){ /*...*/ }
});

var Tasks = Spine.Controller.create({
  proxied: ["addAll", "addOne"],

  init: function(){
    Task.bind("refresh", this.addAll);
    Task.bind("create", this.addOne);
  },

  addOne: function(item){
    var task = new TasksItem({item: item});
    this.el.append(task.render().el);
  },

  addAll: function(){
    Task.each(this.addOne);
  }
});









// Building a Contacts Manager

// Contact Model



// Create the model
var Contact = Spine.Model.setup("Contact", ["first_name", "last_name", "email"]);

// Persist model between page reloads
//Contact.extend(Spine.Model.Local);


// Add some instance functions
Contact.include({
  fullName: function(){
    if ( !this.first_name && !this.last_name ) return;
    return (this.first_name + " " + this.last_name);
  }
}):






// Sidebar Controller


jQuery(function($){

  winodw.Sidebar = Spine.controller.create({
    // Create instance variables:
    // this.items //=> <ul></ul>
    elements: {
      ".items": "items"
    },

    // Attach event delegation
    events: {
      "click button": "create"
    },

    // Ensure these functions are called with the current
    // scope as they're used in event callbacks
    proxied: ["render"],

    // Render template
    template: function(items){
      return($("#contactsTemplate").tmpl(items));
    },

    init: function(){
      this.list = Spine.List.init({
        el: this.items,
        template: this.template
      });

      // When the list's current item changes, show the contact
      this.list.bind("change", this.proxy(function(item){
        this.App.trigger("show:contact", item);
      }));

      // When the current contact changes, i.e., when a new contact is created,
      // change the list's currently selected item
      this.App.bind("show:contact edit:contact", this.list.change);

      // Rerender whenever contacts are populated or changed
      Contact.bind("refresh change", this.render);
    },

    render: function(){
      var items = Contact.all();
      this.list.render(items);
    },

    // Called when 'Create' button is clicked
    create: function(){
      var item = Contact.create();
      this.App.trigger("edit:contact", item);
    }
  });
});








// Contacts Controller

jQuery(function($){

  window.Contacts = Spine.Controller.create({
    // Populate internal element properties
    elements: {
      ".show": "showEl",
      ".show .content": "showContent",
      ".edit"; "editEl"
    },

    proxied: ["render", "show"],

    init: function(){
      // Initial view shows contact
      this.show();

      // Rerender the view when the contact is changed
      Contact.bind("change", this.render);

      // Bind to global events
      this.App.bind("show:contact", this.show);
    },

    change: function(item){
      this.current = item;
      this.render();
    },

    render: function(){
      this.showContent.html($("#contactTemplate").tmpl(this.current));
    },

    show: function(item){
      if (item && item.model) this.change(item);

      this.showEl.show();
      this.editEl.hide();
    }
  });





// App Controller

jQuery(function($){
  window.App = Spine.Controller.create({
    el: $("body"),

    elements: {
      "#sidebar": "sidebarEl",
      "#contacts": "contactsEl"
    },

    init: function(){
      this.sidebar = Sidebar.init({el: this.sidebarEl});
      this.contact = Contacts.init({el: this.contactsEl});

      // Fetch contacts from local storage
      Contact.fetch();
    }
  }).init();
});


