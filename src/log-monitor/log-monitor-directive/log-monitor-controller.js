export class LogMonitorController {
  constructor(devToolsService, devToolsActionCreatorsService, $scope) {
    'ngInject';

    const unsubscribe = devToolsService.connect(this.select || (state => state))(this);
    $scope.$on('$destroy', unsubscribe);

    this.store = devToolsService.store;
    this.actions = devToolsActionCreatorsService;
    this.$scope = $scope;
  }

  getActionById(actionId) {
    return this.actionsById[actionId].action;
  }

  getError(index) {
    return this.computedStates[index].error;
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
    this.store.dispatch(this.actions.reset());
  }

  revert() {
    this.store.dispatch(this.actions.rollback());
  }

  sweep() {
    this.store.dispatch(this.actions.sweep());
  }

  commit() {
    this.store.dispatch(this.actions.commit());
  }

  hasComputedStates() {
    return this.computedStates.length > 1;
  }

  hasSkippedActions() {
    return this.skippedActionIds.length > 0;
  }
}
