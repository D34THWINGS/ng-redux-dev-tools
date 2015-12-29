export class LogMonitorController {
  constructor(devToolsService, devToolsActionCreatorsService, $scope) {
    'ngInject';

    const unsubscribe = devToolsService.connect()(state => state)(this);
    $scope.$on('$destroy', unsubscribe);

    this.store = devToolsService.store;
    this.actions = devToolsActionCreatorsService;
  }

  getActionById(actionId) {
    return this.actionsById[actionId].action;
  }

  getComputedState(index) {
    return this.computedStates[index].state;
  }

  getPreviousComputedState(index) {
    return index > 0 ? this.computedStates[index - 1].state : null;
  }

  isSkippedAction(id) {
    return this.skippedActionIds.indexOf(id) > -1;
  }

  handleToggleAction(id) {
    if (id > 0) {
      this.store.dispatch(this.actions.toggleAction(id));
    }
  }

  reset() {
    return this.store.dispatch(this.actions.reset());
  }

  revert() {
    return this.store.dispatch(this.actions.rollback());
  }

  sweep() {
    return this.store.dispatch(this.actions.sweep());
  }

  commit() {
    return this.store.dispatch(this.actions.commit());
  }

  hasComputedStates() {
    return this.computedStates.length > 1;
  }

  hasSkippedActions() {
    return this.skippedActionIds.length > 0;
  }
}
