// 12.backbone.js

var assert = function(value, msg){
  if ( !value )
    throw(msg || (value + " does not equal true"));
};

var assertEqual = function(val1, val2, msg){
  if (val1 !== val2)
    throw(msg || (val1 + " does not equal " + val2));
};




// Modles


var User = Backbone.Model.extend({
  initialize: function() {
  }
});


var User = Backbone.Model.extend({
  // Class properties
  classProperty: "bar"
}, {
  // Instance properties
  instanceProperty: "foo"
});

assertEqual( User.instanceProperty, "foo" );
assertEqual( User.prototype.classProperty, "bar" );



var User = Backbone.Model.extend({
  initialize: function(name) {
    this.set({name: name});
  }
});

var user = new User("Leo McGarry");
assertEqual( user.get("name"), "Leo McGarry");





// Models and Attributes

var user = new User();
user.set({name: "Donna Moss"});

assertEqual( user.get("name"), "Donna Moss" );
//assertEqual( user.attributes, {name: "Donna Moss"} );



var User = Backbone.Model.extend({
  validate: function(atts){
    if (!atts.email || atts.email.length < 3){
      return "email must be at least 3 chars";
    }
  }
});


var user = new User;

user.bind("error", function(model, error) {
  // Handle error
});

user.set({email: "ga"});

user.set({"email": "ga"}, {error: function(model, error){
  // ...
}});


var Chat = Backbone.Model.extend({
  defaults: {
    from: "anonymous"
  }
});

assertEqual( (new Chat).get("from"), "anonymous" );







// Collections

var Users = Backbone.Collection.extend({
  model: User
});


var users = new User([{name: "Toby Ziegler"}, {name: "Josh Lyman"}]);

var users = new Users;


// Add an individual model
users.add({name: "Donna Moss"});

// Or add an array of models
users.add([{name: "Josiah Bartlet"}, {name: "Charlie Yount"}]);


users.bind("add", function(user) {
  alert("Ahory " + user.get("name") + "!");
});


//users.add({name: "FreeBz"});

users.bind("remove", function(user) {
  alert("Adios " + user.get("name") + "!");
});

//users.remove(users.models[0]);


var user = users.get("some-guid");

//var user = users.getByCid("c-some-cid");

var user = new User({name: "Adam Buxton"});

var users = new Backbone.Collection;

users.bind("change", function(rec) {
  // A record was changed!
});
users.add(user);

user.set({name: "Joe Cornish"});





// Controlling a Collection's Order

var Users = Backbone.Collection.extend({
  comparator: function(user) {
    return user.get("name");
  }
});






// Views

var UserView = Backbone.View.extend({
  initialize: function(){},
  render: function(){}
});



var UserView = Backbone.View.extend({
  tagName: "span",
  className: "users"
});

assertEqual( (new UserView).el.className, "users" );


var UserView = Backbone.View.extend({
  el: $(".users")
});

new UserView({id: "followers"});






// Rendering Views

var TodoView = Backbone.View.extend({
  //template: _.template($("#todo-template").html()),

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }
});


//new TodoView({model: new Todo});





// Delegating Events

var TodoView = Backbone.View.extend({
  events: {
    "change input[type=checkbox]": "toggleDone",
    "click .destroy"             : "clear",
    //"toggleDone": "change input[type=checkbox]",
    //"clear": "click .destroy"
  },

  toggleDone: function(e){},
  clear: function(e){}
});






// Binding and Context

var TodoView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'remove');
    this.model.bind('change', this.render);
    this.model.bind('delete', this.remove);
  },

  remove: function(){
    $(this.el).remove();
  }
});





// Controllers   Router로 명칭 변경

//var PageController = Backbone.Controller.extend({
var PageController = Backbone.Router.extend({
  routes: {
    "":                     "index",
    "help":                 "help",
    "search/:query":        "search",
    "search/:query/p:page": "search"
  },

  index: function() { },

  help: function() {

  },

  search: function(query, page) {

  }
});



var PageController = Backbone.Router.extend({
  routes: {
    "!/page/:title": "page",
  }

});



var PageController = Backbone.Router.extend({
  initialize: function() {
    this.route(/pages\/(\d+)/, 'id', function(pageId){

    });
  }
});


//Backbone.history.saveLocation("/page/" + this.model.id);
Backbone.history.start();









// Syncing with the Server

var User = Backbone.Model.extend({
  url: '/users'
});



var user = new User();
user.set({name: "Bernard"});

user.save(null, {success: function(){

}});


user.bind("error", function(e) {

});

user.save({email: "Invalid email"});






// Populating Collections

var Followers = Backbone.Collection.extend({
  model: User,
  url: "/followers"
});

//Followers.fetch();







// On the Server Side

// Custom Behavior

/*
Backbone.sync = function(method, model, options) {
  console.log(method, model, options);
  options.success(model);
};



Todo.prototype.sync = function(method, model, options) {

};
*/

// Save all of the todo items under the "todos" localstorage namespace.
//Todos.prototype.localstorage = new Store("todos");


// Override Backbone.sync() to use a delegate to the model or collection's
// localStorage property, which should be an instance of Store.
Backbone.sync = function(method, model, options) {

  var resp;
  var store = model.localStorage || model.collection.localStorage;

  switch (method) {
    case "read":    resp = model.id ? store.find(model) : store.findall(); break;
    case "create":  resp = store.create(model); break;
    case "update":  resp = store.update(model); break;
    case "delete":  resp = store.destroy(model); break;
  }

  if (resp) {
    options.success(resp);
  } else {
    options.error("record not found");
  }
};






