export default Ember.Controller.extend(EmberPusher.ClientEvents, {
  PUSHER_SUBSCRIPTIONS: {
    blog-posts: ['post-added']
  },
  actions: {
    postAdded: function(payload) {
      this.store.pushPayload(payload);
    }
  }
});
