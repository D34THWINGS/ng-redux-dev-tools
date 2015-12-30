export const ActionTypes = {
  PERFORM_ACTION: 'PERFORM_ACTION',
  RESET: 'RESET',
  ROLLBACK: 'ROLLBACK',
  COMMIT: 'COMMIT',
  SWEEP: 'SWEEP',
  TOGGLE_ACTION: 'TOGGLE_ACTION',
  JUMP_TO_STATE: 'JUMP_TO_STATE',
  IMPORT_STATE: 'IMPORT_STATE'
};

export const ActionCreators = {
  performAction(action) {
    return {type: ActionTypes.PERFORM_ACTION, action, timestamp: Date.now()};
  },

  reset() {
    return {type: ActionTypes.RESET, timestamp: Date.now()};
  },

  rollback() {
    return {type: ActionTypes.ROLLBACK, timestamp: Date.now()};
  },

  commit() {
    return {type: ActionTypes.COMMIT, timestamp: Date.now()};
  },

  sweep() {
    return {type: ActionTypes.SWEEP};
  },

  toggleAction(id) {
    return {type: ActionTypes.TOGGLE_ACTION, id};
  },

  jumpToState(index) {
    return {type: ActionTypes.JUMP_TO_STATE, index};
  },

  importState(nextLiftedState) {
    return {type: ActionTypes.IMPORT_STATE, nextLiftedState};
  }
};
