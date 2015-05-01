import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  host: 'http://bloggor.danwrighteo.us',
  namespace: 'api'
});
