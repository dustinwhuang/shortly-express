Shortly.LoginView = Backbone.View.extend({
  className: 'login',

  template: Templates['login'],

  events: {
    'submit': 'login'
  },

  initialize: function(router) {
    this.router = router;
  },

  render: function() {
    this.$el.html( this.template() );
    return this;
  },

  login: function(e) {
    e.preventDefault();
    var $username = this.$el.find('form #username');
    var $password = this.$el.find('form #password');
    var log = new Shortly.Login({
      username: $username.val(),
      password: $password.val()
    });
    log.save({})
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
      .html('Invalid credentials')
      .addClass('error');
    this.router.navigate('/login', { trigger: true });
    return this;
  },

});
