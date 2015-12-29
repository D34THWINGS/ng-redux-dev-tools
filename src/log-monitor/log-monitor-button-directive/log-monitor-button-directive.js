export default function logMonitorButtonDirective() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: `
      <button
       ng-class="logMonitorBtnCtrl.getBtnClass()"
       ng-disabled="!logMonitorBtnCtrl.enabled" ng-transclude></button>`,
    scope: {},
    bindToController: {
      enabled: '='
    },
    controllerAs: 'logMonitorBtnCtrl',
    controller() {
      this.getBtnClass = function () {
        return `log-monitor__button${this.enabled ? '--enabled' : '--disabled'}`;
      };
    }
  };
}
