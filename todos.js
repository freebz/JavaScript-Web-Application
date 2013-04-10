// todos.js

jQuery(function($){
  // Application goes here...

});

window.Todo = Backbone.Model.extend({
  defaults: {
    done: false
  },

  toggle: function() {
    this.save({done: !this.get("done")});
  }
});


window.TodoList = Backbone.Collection.extend({
  model: Todo,

  // Save all of the to-do items under the "todos" namespace.
  localStorage: new Store("todos"),

  // Filter down the list of all to-do items that are finished.
  done: function() {
    return this.filter(function(todo){ return todo.get('done'); });
  },

  remaining: function() {
    return this.without.apply(this, this.done());
  }
});


// Create our global collection of Todos.
window.Todos = new TodoList;




window.TodoView = Backbone.View.extend({

  // View is a list tag.
  tagName: "li",

  // Cache the template function for a single item.
  template: $("#item-template").template(),

  // Delegate events to view functions
  events: {
    "change     .click"         : "toggleDone",
    "dbclick    .todo-content"  : "edit",
    "click      .todo-destroy"  : "destroy",
    "keypress   .todo-input"    : "updateOnEnter",
    "blur       .todo-input"    : "close"
  },

  initialize: function() {
    // Make sure functions are called in the right scope
    _.bindAll(this, 'render', 'close', 'remove');

    // Listen to model changes
    this.model.bind('change', this.render);
    this.model.bind('destroy', this.remove);
  },

  render: function() {
    // Update el with stored template
    var element = jQuery.tmpl(this.template, this.model.toJSON());
    $(this.el).html(element);
    return this;
  },

  // Toggle model's done status when the checkbox is checked
  toggleDone: function() {
    this.model.toggle();
  },

  // Switch this view into `"editing"` mode, displaying the input field.
  edit: function() {
    $(this.el).addClass("editing");
    this.input.focus();
  },

  // Close the `"editing"` mode, saving changes to the to-do.
  close: function(e) {
    this.model.save({content: this.input.val()});
    $(this.el).removeClass("edting");
  },

  // If you hit `enter`, we're through editing the item.
  // Fire the blur event on the input, triggering close()
  updateOnEnter: function(e) {
    if (e.keyCode == 13 ) e.target.blur();
  },

  // Remove element when model is destroyed
  remove: function() {
    $(this.el).remove();
  },

  // Destory model when '.doto-destroy' is clicked
  destroy: function() {
    this.model.destroy();
  }
});





// Our overall AppView is the top-level piece of UI.
window.AppView = Backbone.View.extend({

  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML.
  el: $("todoapp"),

  events: {
    "keypress #new-todo":   "createOnEnter",
    "click .todo-clear a":  "clearCompleted"
  },

  // At initialization, we bind to the relevant events on the `Todos`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting to-dos that might be saved in *localStorage*.
  initialize: function() {
    _.bindAll(this, 'addOne', 'addAll', 'render');

    this.input = this.$("#new-todo");

    Todos.bind('add',     this.addOne);
    Todos.bind('refresh', this.addAll);

    Todos.fetch();
  },

  // Add a single to-do item to the list by creating a view for it and
  // appending its element to the `<ul>`.
  addOne: function(todo) {
    var view = new TodoView({model: todo});
    this.$("#todo-list").append(view.render().el);
  },

  // Add all items in the Todos collection at once.
  addAll: function() {
    Todois.each(this.addOne);
  },

  // If you hit return in the main input field, create new Todo model
  createOnEnter: function(e) {
    if (e.keyCode != 13) return;

    var vlaue = this.input.val();
    if ( !value ) return;

    Todos.create({content: value});
    this.input.val('');
  },

  clearCompleted: function() {
    _.each(Todos.done(), function(doto){ todo.destroy(); });
    return false;
  }
});


// Finally, we kick things off by creating the App.
window.App = new AppView;



