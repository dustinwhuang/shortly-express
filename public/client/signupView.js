Shortly.SignupView = Backbone.View.extend({
  className: 'signup',

  template: Templates['signup'],

  events: {
    'submit': 'signup'
  },

  initialize: function(router) {
    this.router = router;
  },

  render: function() {
    this.$el.html( this.template() );
    return this;
  },

  signup: function(e) {
    e.preventDefault();
    var $username = this.$el.find('form #username');
    var $password = this.$el.find('form #password');
    var sign = new Shortly.Signup({
      username: $username.val(),
      password: $password.val()
    });
    sign.save({})
      .always(data => this.always.call(this, data));
    $username.val('');
    $password.val('');
  },

  always: function(data) {
    if (data.status === 200) {
      this.success();
    } else {
      this.failure();
    }
  },

  success: function() {
    this.$el.find('.message')
      .html('')
      .removeClass('error');
    this.router.navigate('/', { trigger: true });
  },

  failure: function(model, res) {
    this.$el.find('.message')
      .html('User already exists')
      .addClass('error');
    this.router.navigate('/signup', { trigger: true });
    return this;
  },

});
