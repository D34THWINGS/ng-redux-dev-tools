/* eslint-disable */

function reducer(state, action) {
  state = state || {count: 0};

  if (action.type === 'TEST') {
    return {count: state.count + action.payload.value};
  }

  return state;
}

function increment(value) {
  return {type: 'TEST', payload: {value: value}};
}

angular.module('myApp', ['ngRedux', ngReduxDevTools.default])
  .config(function ($ngReduxProvider, devToolsServiceProvider) {
    $ngReduxProvider.createStoreWith(reducer, [], [devToolsServiceProvider.instrument()]);
  })
  .run(function ($ngRedux) {
    $ngRedux.dispatch(increment(3));
  })
  .controller('TestController', function ($scope, $ngRedux) {
    $scope.$on('$destroy', $ngRedux.connect(state => state)(this));

    this.value = 1;

    this.increment = function () {
      $ngRedux.dispatch(increment(this.value));
    };
  });
