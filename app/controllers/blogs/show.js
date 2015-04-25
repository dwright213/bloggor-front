import Ember from 'ember';
import EmberPusher from 'ember-pusher';

export default Ember.Controller.extend(EmberPusher.Bindings, {
  logPusherEvents: true,
  PUSHER_SUBSCRIPTIONS: {
    blogsChannel: ['new-blog', 'delete-blog' ]
  },
  actions: {
    newBlog: function(payload) {
      console.log(payload);
      this.store.pushPayload('blog', payload);
    },
    deleteBlog: function(payload) {
      console.log(payload.blog.id);
      this.transitionToRoute('blogs');

      this.store.find('blog', payload.blog.id).then(function (blog) {
        blog.deleteRecord();
      });
    }
  }
});
