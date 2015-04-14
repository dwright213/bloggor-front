import Ember from 'ember';
import EmberPusher from 'ember-pusher';

export default Ember.Controller.extend(EmberPusher.Bindings, {
  logPusherEvents: true,
  PUSHER_SUBSCRIPTIONS: {
    blogsChannel: ['new-blog']
  },
  actions: {
    newBlog: function(payload) {
      console.log(payload);
      this.store.pushPayload('blog', payload);
    }
  }

});
