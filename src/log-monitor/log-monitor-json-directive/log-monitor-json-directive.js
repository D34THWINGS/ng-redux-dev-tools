import devToolsJSONDirectiveTemplate from './log-monitor-json-directive.html';

export default function devToolsJSONDirective(RecursionHelper) {
  'ngInject';

  return {
    restrict: 'E',
    replace: true,
    template: devToolsJSONDirectiveTemplate,
    scope: {
      key: '=',
      value: '=',
      startExpanded: '&?'
    },
    controllerAs: 'jsonCtrl',
    controller: 'LogMonitorJSONController',
    compile(elem) {
      return RecursionHelper.compile(elem, this);
    }
  };
}
