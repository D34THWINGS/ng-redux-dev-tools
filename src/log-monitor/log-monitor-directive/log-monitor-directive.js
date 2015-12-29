import logMonitorDirectiveTemplate from './log-monitor-directive.html';

export default function logMonitorDirective() {
  return {
    restrict: 'E',
    replace: true,
    require: '^devTools',
    template: logMonitorDirectiveTemplate,
    controllerAs: 'logMonitorCtrl',
    controller: 'LogMonitorController'
  };
}
