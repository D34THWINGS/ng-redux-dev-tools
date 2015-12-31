import {toggleVisibility} from '../reducer';

export class DockMonitorController {
  constructor(devToolsService, $scope) {
    'ngInject';

    const unsubscribe = devToolsService.connect(state => state)(this);
    $scope.$on('$destroy', unsubscribe);

    this.store = devToolsService.store;

    if (this.defaultVisible) {
      this.store.dispatch(toggleVisibility());
    }
  }

  getDockMonitorClass() {
    return `dock-monitor--${this.monitorState.isVisible ? 'visible' : 'hidden'}`;
  }

  toggleVisibility() {
    this.store.dispatch(toggleVisibility());
  }
}
