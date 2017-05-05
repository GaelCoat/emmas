var appear = require('./appear');
var isMobile = require('./isMobile');

const AppView = Backbone.View.extend({

  events: {
    'click .scrollTo': 'scrollTo',
  },

  initialize: function() {

  },

  scrollTo: function(e) {

    var section = this.$el.find(e.currentTarget).data('scroll');
    $('html, body').animate( { scrollTop: $('#'+section).offset().top }, 750 );
    return this;
  },

  initMap: function() {

    var Google = window.google;
    var zoom = 17;

    if (isMobile) zoom = 21;
    var image = 'img/cursor.png';

    var map = new Google.maps.Map(this.$el.find('#map').get(0), {
      center: {lat: 44.7736811, lng: -0.6147753},
      scrollwheel: false,
      zoom: zoom
    });

    var marker = new Google.maps.Marker({
      map: map,
      icon: image,
      position: {lat: 44.7736811, lng: -0.6147753}
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
    .delay(3000)
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
