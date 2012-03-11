jQuery(function () {
  var app = new Comparotron.Application();
  Backbone.history.start();
});

var Comparotron = Comparotron || {};

(function($, my) {

// ## The primary view for the entire application
//
my.Application = Backbone.Router.extend({
  routes: {
    '': 'home'
  },

  home: function() {
    this.switchView('home');
    var url = 'http://thedatahub.org/api/data/eca3d7c2-f150-45e4-8749-0c4ba24505fe';
    var dataset = new recline.Model.Dataset({
        id: 'default',
        url: url
      },
      'elasticsearch'
    );
    var $search = $('.backbone-page.home form');
    var results = new my.Results({
      model: dataset
    });
    var $results = $('.backbone-page.home ');
    $search.submit(function(e) {
      e.preventDefault();
      var q = $search.find('input[name="q"]').val();
      dataset.query({q: q}).done(function() {
      });
    });
    $('.backbone-page.home').append(results.el);
  },

  switchView: function(path) {
    $('.backbone-page').hide(); 
    var cssClass = path.replace('/', '-');
    $('.' + cssClass).show();
  }
});

my.Results = Backbone.View.extend({
  template: ' \
    <div class="results"> \
      <div class="summary"> \
        Found: {{docCount}} \
      </div> \
    </div> \
  ',
  initialize: function() {
    this.el = $(this.el);
    _.bindAll(this, 'render');
    this.model.bind('query:done', this.render);
  },
  render: function() {
    var templated = $.mustache(this.template, this.model.toTemplateJSON());
    this.el.html(templated);
  }
});

}(jQuery, Comparotron));
