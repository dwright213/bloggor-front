import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('about');
  this.resource('blogs', function() {
    this.route('show', {path: ':blog_id'});
  });
});


export default Router;
