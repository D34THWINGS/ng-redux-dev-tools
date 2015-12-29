import logMonitorEntryDirectiveTemplate from './log-monitor-entry-directive.html';

export default function logMonitorEntryDirective() {
  return {
    restrict: 'E',
    template: logMonitorEntryDirectiveTemplate,
    scope: {},
    bindToController: {
      actionId: '=',
      action: '=',
      state: '=',
      collapsed: '=',
      toggleActionHandler: '&'
    },
    controllerAs: 'logEntryCtrl',
    controller: 'LogMonitorEntryController'
  };
}
