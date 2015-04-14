import Ember from 'ember';
import EmberPusher from 'ember-pusher';

export default Ember.Controller.extend(EmberPusher.ClientEvents, {
  logPusherEvents: true,
  PUSHER_SUBSCRIPTIONS: {
    bloggor: ['new-blog']
  },

  actions: {
    newBlog: function(payload) {
      console.log('triggered!');
      this.store.pushPayload(payload);
    }
  }

});
