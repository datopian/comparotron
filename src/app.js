var DEMODATA = null;

jQuery(function () {
  var url = 'data/demo.json';
  $.ajax({
    url: url,
    success: function(data) {
      DEMODATA = JSON.parse(data);
      var app = new Comparotron.Application();
      Backbone.history.start();
    }
  });
});

var Comparotron = Comparotron || {};

(function($, my) {

my.QueryResult = Backbone.Model.extend({
});

my.Record = Backbone.Model.extend({
});

my.RecordList = Backbone.Collection.extend({
  model: my.Record
});


// ## The primary view for the entire application
//
my.Application = Backbone.Router.extend({
  routes: {
    '': 'home'
  },

  home: function() {
    this.switchView('home');
    var url = 'http://thedatahub.org/api/data/4faaef85-3b22-4ebb-ad28-fcc6bd4f5f3d/_search';
//     var url = 'http://localhost:9200/ckan-localhost/874e6e14-b392-48cb-9ec6-3941deeb2b98';
    var $search = $('.backbone-page.home form');
    var queryResult = new my.QueryResult();
    var results = new my.Results({
      model: queryResult
    });
    var selected = new my.RecordList();
    var selectedView = new my.Selected({
      collection: selected
    });
    results.selected = selected;
    var $results = $('.backbone-page.home');
    $search.submit(function(e) {
      e.preventDefault();
      var q = $search.find('input[name="q"]').val();
      var query = {
        'query': {
          'match_all': {}
        },
        size: 10
      };
      var jqxhr = $.ajax({
        url: url,
        data: {source: JSON.stringify(query)}
      });
      jqxhr.done(function(data) {
        var hits = _.map(data.hits.hits, function(item) {
          return item._source;
        });
        queryResult.set({
          total: data.hits.total,
          hits: hits
        });
      });
    });
    $('.backbone-page.home .2nd').append(results.el);
    $('.backbone-page.home .2nd').append(selectedView.el);
  },

  switchView: function(path) {
    $('.backbone-page').hide(); 
    var cssClass = path.replace('/', '-');
    $('.' + cssClass).show();
  }
});

my.Results = Backbone.View.extend({
  template: ' \
    <div class="results span6"> \
      <h2>Search Results (<span class="docCount">docCount</span>)</h2> \
      <div class="bubbles-viz"></div> \
    </div> \
  ',
  initialize: function() {
    this.el = $(this.el);
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
  },
  render: function() {
    var templated = $(this.template);
    templated.find('.docCount').text(this.model.toJSON().total);
    templated = $('<div />').append(templated);
    this.el.html(templated.html());
    this.doViz();
  },
  doViz: function() {
    var self = this;
    var r = 600,
      format = d3.format(",d"),
      fill = d3.scale.category20c();

    var bubble = d3.layout.pack()
      .sort(null)
      .size([r, r]);

    var vis = d3.select('.bubbles-viz').append("svg")
      .attr("width", r)
      .attr("height", r)
      .attr("class", "bubble");

    var dataItems = this.model.get('hits').map(function(item) {
      return {
        label: item.region + ' - ' + item.year
        , value: parseInt(item.value)
        , backboneObject: item
      };
    });
    dataItems = {children: dataItems};
    var node = vis.selectAll("g.node")
        .data(bubble.nodes(dataItems)
        .filter(function(d) { return !d.children; }))
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.label + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return fill(d.label); });

    node.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .text(function(d) { return d.label.substring(0, d.r / 3); });

    node.on('click', function(d) {
      if (!self.selected.include(d.backboneObject)) {
        self.selected.add(d.backboneObject);
      }
    });
  }
});

my.Selected = Backbone.View.extend({
  template: ' \
    <div class="selected span6"> \
      <h2> \
        Selected Items \
        <a href="#" class="btn btn-primary finished" style="float: right;">I\'m done, time to design and share</a> \
      </h2> \
      <div class="selected-viz"></div> \
    </div> \
  ',
  events: {
    'click .finished': 'onFinished'
  },
  initialize: function() {
    this.el = $(this.el);
    _.bindAll(this, 'render');
    this.collection.bind('add', this.render);
    this.collection.bind('remove', this.render);
  },
  onFinished: function(e) {
    alert('Not yet implemented :-)');
  },
  render: function() {
    var templated = $(this.template).clone();
    this.el.html(templated.html());
    this.doViz();
  },
  doViz: function() {
    var self = this;
    var r = 600,
      format = d3.format(",d"),
      fill = d3.scale.category20c();

    var bubble = d3.layout.pack()
      .sort(null)
      .size([r, r]);

    var vis = d3.select('.selected-viz').append("svg")
      .attr("width", r)
      .attr("height", r)
      .attr("class", "bubble");

    var dataItems = this.collection.map(function(item) {
      return {
        label: item.get('region') + ' - ' + item.get('year')
        , value: parseInt(item.get('value'))
        , backboneObject: item
      };
    });
    dataItems = {children: dataItems};
    var node = vis.selectAll("g.node")
        .data(bubble.nodes(dataItems)
        .filter(function(d) { return !d.children; }))
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.label + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return fill(d.label); });

    node.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .text(function(d) { return d.label.substring(0, d.r / 3); });

    node.on('click', function(d) {
      if (self.collection.include(d.backboneObject)) {
        self.collection.remove(d.backboneObject);
      }
    });
  }
});

}(jQuery, Comparotron));
