import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  host: 'http://bloggor.herokuapp.com',
  namespace: 'api'
});
