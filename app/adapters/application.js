import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  host: 'https://bloggor.herokuapp.com',
  namespace: 'api'
});
