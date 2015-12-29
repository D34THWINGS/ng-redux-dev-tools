/* eslint complexity: 0 */

import difference from 'lodash/array/difference';

import {DevToolsService} from './dev-tools-service';
import {ActionTypes, ActionCreators} from './actions';

export class DevToolsServiceProvider {
  constructor($injector) {
    'ngInject';

    this.monitorReducers = [];
    this.INIT_ACTION = {type: '@@INIT'};

    this.$injector = $injector;
  }

  registerReducer(reducer) {
    this.monitorReducers.push(reducer);
  }

  computeNextEntry(reducer, action, state, error) {
    if (error) {
      return {
        state,
        error: 'Interrupted by an error up the chain'
      };
    }

    let nextState = state;
    let nextError;
    try {
      nextState = reducer(state, action);
    } catch (err) {
      nextError = err.toString();
      if (typeof window === 'object' && typeof this.$injector.get('$window').chrome !== 'undefined') {
        // In Chrome, rethrowing provides better source map support
        setTimeout(() => {
          throw err;
        });
      } else {
        this.$injector.get('$log').error(err.stack || err);
      }
    }

    return {
      state: nextState,
      error: nextError
    };
  }

  recomputeStates(states, minStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds) {
    // Optimization: exit early and return the same reference
    // if we know nothing could have changed.
    if (minStateIndex >= states.length && states.length === stagedActionIds.length) {
      return states;
    }

    const nextComputedStates = states.slice(0, minStateIndex);
    for (let i = minStateIndex; i < stagedActionIds.length; i += 1) {
      const stagedActionId = stagedActionIds[i];
      const action = actionsById[stagedActionId].action;

      const previousEntry = nextComputedStates[i - 1];
      const previousState = previousEntry ? previousEntry.state : committedState;
      const previousError = previousEntry ? previousEntry.error : undefined; // eslint-disable-line no-undefined

      const shouldSkip = skippedActionIds.indexOf(stagedActionId) > -1;
      const entry = shouldSkip ?
        previousEntry :
        this.computeNextEntry(reducer, action, previousState, previousError);

      nextComputedStates.push(entry);
    }

    return nextComputedStates;
  }

  static liftAction(action) {
    return ActionCreators.performAction(action);
  }

  static unliftState(liftedState) {
    const {computedStates, currentStateIndex} = liftedState;
    const {state} = computedStates[currentStateIndex];
    return state;
  }

  unliftStore(liftedStore, liftReducer) {
    let lastDefinedState;

    return Object.assign({}, liftedStore, {
      liftedStore,

      dispatch(action) {
        liftedStore.dispatch(DevToolsServiceProvider.liftAction(action));
        return action;
      },

      getState() {
        const state = DevToolsServiceProvider.unliftState(liftedStore.getState());
        if (!!state) {
          lastDefinedState = state;
        }
        return lastDefinedState;
      },

      replaceReducer(nextReducer) {
        liftedStore.replaceReducer(liftReducer(nextReducer));
      }
    });
  }

  liftReducerWith(reducer, initialCommittedState, monitorReducer) {
    const initialLiftedState = {
      monitorState: monitorReducer(undefined, {}), // eslint-disable-line no-undefined
      nextActionId: 1,
      actionsById: {0: DevToolsServiceProvider.liftAction(this.INIT_ACTION)},
      stagedActionIds: [0],
      skippedActionIds: [],
      committedState: initialCommittedState,
      currentStateIndex: 0,
      computedStates: []
    };

    // Manages how the history actions modify the history state.
    return (liftedState = initialLiftedState, liftedAction) => {
      let {
        monitorState,
        actionsById,
        nextActionId,
        stagedActionIds,
        skippedActionIds,
        committedState,
        currentStateIndex,
        computedStates
        } = liftedState;

      // By default, agressively recompute every state whatever happens.
      // This has O(n) performance, so we'll override this to a sensible
      // value whenever we feel like we don't have to recompute the states.
      let minInvalidatedStateIndex = 0;

      switch (liftedAction.type) {
      case ActionTypes.RESET:
        // Get back to the state the store was created with.
        actionsById = {0: DevToolsServiceProvider.liftAction(this.INIT_ACTION)};
        nextActionId = 1;
        stagedActionIds = [0];
        skippedActionIds = [];
        committedState = initialCommittedState;
        currentStateIndex = 0;
        computedStates = [];
        break;
      case ActionTypes.COMMIT:
        // Consider the last committed state the new starting point.
        // Squash any staged actions into a single committed state.
        actionsById = {0: DevToolsServiceProvider.liftAction(this.INIT_ACTION)};
        nextActionId = 1;
        stagedActionIds = [0];
        skippedActionIds = [];
        committedState = computedStates[currentStateIndex].state;
        currentStateIndex = 0;
        computedStates = [];
        break;
      case ActionTypes.ROLLBACK:
        // Forget about any staged actions.
        // Start again from the last committed state.
        actionsById = {0: DevToolsServiceProvider.liftAction(this.INIT_ACTION)};
        nextActionId = 1;
        stagedActionIds = [0];
        skippedActionIds = [];
        currentStateIndex = 0;
        computedStates = [];
        break;
      case ActionTypes.TOGGLE_ACTION:
        // Toggle whether an action with given ID is skipped.
        // Being skipped means it is a no-op during the computation.
        const {id: liftedActionId} = liftedAction;
        const index = skippedActionIds.indexOf(liftedActionId);
        if (index === -1) {
          skippedActionIds = [liftedActionId, ...skippedActionIds];
        } else {
          skippedActionIds = skippedActionIds.filter(id => id !== liftedActionId);
        }
        // Optimization: we know history before this action hasn't changed
        minInvalidatedStateIndex = stagedActionIds.indexOf(liftedActionId);
        break;
      case ActionTypes.JUMP_TO_STATE:
        // Without recomputing anything, move the pointer that tell us
        // which state is considered the current one. Useful for sliders.
        currentStateIndex = liftedAction.index;
        // Optimization: we know the history has not changed.
        minInvalidatedStateIndex = Infinity;
        break;
      case ActionTypes.SWEEP:
        // Forget any actions that are currently being skipped.
        stagedActionIds = difference(stagedActionIds, skippedActionIds);
        skippedActionIds = [];
        currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
        break;
      case ActionTypes.PERFORM_ACTION:
        if (currentStateIndex === stagedActionIds.length - 1) {
          currentStateIndex += 1;
        }
        const actionId = nextActionId;
        nextActionId += 1;
        // Mutation! This is the hottest path, and we optimize on purpose.
        // It is safe because we set a new key in a cache dictionary.
        actionsById[actionId] = liftedAction;
        stagedActionIds = [...stagedActionIds, actionId];
        // Optimization: we know that only the new action needs computing.
        minInvalidatedStateIndex = stagedActionIds.length - 1;
        break;
      case ActionTypes.IMPORT_STATE:
        // Completely replace everything.
        ({
          monitorState,
          actionsById,
          nextActionId,
          stagedActionIds,
          skippedActionIds,
          committedState,
          currentStateIndex,
          computedStates
        } = liftedAction.nextLiftedState);
        break;
      case '@@redux/INIT':
        // Always recompute states on hot reload and init.
        minInvalidatedStateIndex = 0;
        break;
      default:
        // If the action is not recognized, it's a monitor action.
        // Optimization: a monitor action can't change history.
        minInvalidatedStateIndex = Infinity;
        break;
      }

      computedStates = this.recomputeStates(
        computedStates,
        minInvalidatedStateIndex,
        reducer,
        committedState,
        actionsById,
        stagedActionIds,
        skippedActionIds
      );
      monitorState = monitorReducer(monitorState, liftedAction);
      return {
        monitorState,
        actionsById,
        nextActionId,
        stagedActionIds,
        skippedActionIds,
        committedState,
        currentStateIndex,
        computedStates
      };
    };
  }

  liftReducer(reducer, initialState) {
    return this.liftReducerWith(reducer, initialState, (state, action) => {
      return this.monitorReducers.reduce((s, r) => r(s, action), state);
    });
  }

  instrument() {
    return createStore => (reducer, initialState) => {
      const liftedStore = createStore(this.liftReducer(reducer, initialState));
      return this.unliftStore(liftedStore, this.liftReducer);
    };
  }

  $get($ngRedux) {
    'ngInject';

    return new DevToolsService($ngRedux);
  }
}
