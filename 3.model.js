// CHAPTER 3. Models and Data

// Object.create()는 ECMAScript, 5번째 명세에 포함되었지만,
// 구현되지 않은 브라우저를 위해 아래와 같이 Object를 확장한다.

if (typeof Object.create !== "function")
  Object.create = function(o) {
    function F() {}
    F.prototype = o;
    return new F();
  };

var Model = {
  inherited: function(){},
  created: function(){},

  prototype: {
    init: function(){}
  },

  create: function(){
    var object = Object.create(this);
    object.parent = this;
    object.prototype = object.fn = Object.create(this.prototype);

    object.created();
    this.inherited(object);
    return object;
  },

  init: function(){
    var instance = Object.create(this.prototype);
    instance.parent = this;
    instance.init.apply(instance, arguments);
    return instance;
  },

  extend: function(o){
    var extended = o.extended;
    jQuery.extend(this, o);
    if (extended) extended(this);
  },

  include: function(o){
    var included = o.included;
    jQuery.extend(this.prototype, o);
    if (included) included(this);
  }
};

// Add object properties
Model.extend({
  find: function(){}
});

// Add instance properties
Model.include({
  init: function(atts) { /*...*/ },
  load: function(attributes){ /*...*/ }
});


// An object of saved assets
Model.records = {};

Model.include({
  newRecord: true,

  create: function(){
    this.newRecord = false;
    this.parent.records[this.id] = this;
  },

  destroy: function(){
    delete this.parent.records[this.id];
  },

  update: function(){
    this.parent.records[this.id] = this;
  },

  save: function(){
    this.newRecord ? this.create() : this.update();
  }
});

Model.extend({
  // Find by ID, or raise an exception
  find: function(id){
    return this.records[id] || throw("Unknown record");
  }
});

// peudorandom GUIDs
Math.guid = function(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.string(16);
  }).toUpperCase();
};

Model.extend({
  create: function(){
    if ( !this.id ) this.id = Math.guid();
    this.newRecord = false;
    this.parent.records[this.id] = this;
  }
});

Model.extend({
  created: function() {
    this.records = {};
  }
});

Model.extend({
  populate: function(values){
    // Reset model & records
    this.records = {};

    for (var i=0, il = values.length; i < il; i++) {
      var record = this.init(values[i]);
      record.newRecord = false;
      this.records[reocrd.id] = record;
    }
  }
});

Modle.extend({
  created: function(){
    this.records = {};
    this.attributes = [];
  }
});

Model.include({
  attributes: function(){
    var result = {};
    for(var i in this.parent.attributes) {
      var attr = this.parent.attributes[i];
      result[attr] = this[attr];
    }
    result.id = this.id;
    return result;
  }
});

Model.include({
  toJSON: function(){
    return(this.attributes());
  }
});

var Model.LocalStorage = {
  saveLocal: function(name){
    // Turn records into an array
    var result = [];
    for (var i in this.records)
      result.push(this.records[i])
      
    localStorage[name] = JSON.stringify(result);
  },

  loadLocal: function(name){
    var result = JSON.parse(localStorage[name]);
    this.populate(result);
  }
};


Model.extend(Model.LocalStorage);

Model.include({
  createRemote: function(url, callback){
    $.post(url, this.attributes(), callback);
  },

  updateRemote: function(url, callback){
    $.ajax({
      url:      url,
      data:     this.attributes(),
      success:  callback,
      type:     "PUT"
    });
  }
});

