var appear = require('./appear');
var isMobile = require('./isMobile');

const AppView = Backbone.View.extend({

  events: {
    'click .scrollTo': 'scrollTo',
    'click .button': 'display',
  },

  display: function(e) {

    var type = this.$el.find(e.currentTarget).data('show');

    this.$el.find(".wrap").hide();
    this.$el.find(".wrap[data-type="+type+"]").show();

    return this;
  },    

  scrollTo: function(e) {

    var section = this.$el.find(e.currentTarget).data('scroll');
    $('html, body').animate( { scrollTop: $('#'+section).offset().top }, 750 );
    return this;
  },

  initMap: function() {

    var Google = window.google;
    var zoom = 10;

    if (isMobile) zoom = 11;

    var map = new Google.maps.Map(this.$el.find('#map').get(0), {
      center: {lat: 44.8724469, lng: -1.0923236},
      scrollwheel: false,
      zoom: zoom
    });


    var cityCircle2 = new Google.maps.Circle({
      strokeColor: '#a2e0fd',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#a2e0fd',
      fillOpacity: 0.3,
      map: map,
      center: {lat: 44.8724469, lng: -1.0923236},
      radius: 20000
    });

    var cityCircle3 = new Google.maps.Circle({
      strokeColor: '#a2fda5',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#a2fda5',
      fillOpacity: 0.3,
      map: map,
      center: {lat: 44.8724469, lng: -1.0923236},
      radius: 10000
    });


    return this;
  },

  setSizes: function() {

    if (!isMobile) return this;

    this.$el.find('.setSize').each(function(){

      $(this).height($(this).height());
    });

    return this;
  },

  initPreload: function() {

    var promises = [];


    this.$el.find('.apply-bg').each(function() {

      var $this = $(this);
      var defer = q.defer();
      var url = $this.data('bg');
      var img = new Image();
      img.src = url;
      img.onload = function(){

        $this.css('background-image', 'url('+url+')').attr('data-bg', '');
        return defer.resolve();
      }

      promises.push(defer.promise)
    });

    return promises;
  },

  //-------------------------------------
  // Appear
  //-------------------------------------
  initAppears: function() {

    var that = this;

    // Apparitions
    $('section').appear();
    $('section').on('appear', function(event, $els) { $els.addClass('ready'); });

    return this;
  },

  render: function() {

    var that = this;

    return q.fcall(function() {

      return [
        that.initPreload(),
        that.initAppears(),
        that.setSizes()
      ]
    })
    .all()
    .delay(1000)
    .then(function(){

      that.$el.find('#loader').fadeOut(300);
      that.$el.removeClass('loading');
      return that.initMap();
    });

  },

});

const App = new AppView({
  el: 'body'
});

App.render();
