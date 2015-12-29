export class DevToolsService {
  constructor(store) {
    'ngInject';

    this.defaultMapStateToTarget = () => ({});
    this.defaultMapDispatchToTarget = dispatch => ({dispatch});
    this.store = store.liftedStore;
  }

  connect() {
    return (mapStateToTarget, mapDispatchToTarget) => {

      const finalMapStateToTarget = mapStateToTarget || this.defaultMapStateToTarget;

      const finalMapDispatchToTarget = mapDispatchToTarget || this.defaultMapDispatchToTarget;

      let slice = finalMapStateToTarget(this.store.getState());

      const boundActionCreators = finalMapDispatchToTarget(this.store.dispatch);

      return target => {
        this.updateTarget(target, slice, boundActionCreators);

        return this.store.subscribe(() => {
          const nextSlice = finalMapStateToTarget(this.store.getState());
          if (!this.shallowEqual(slice, nextSlice)) {
            slice = nextSlice;
            this.updateTarget(target, slice, boundActionCreators);
          }
        });
      };
    };
  }

  updateTarget(target, stateSlice, dispatch) {
    if (typeof target === 'function') {
      target(stateSlice, dispatch);
    } else {
      Object.assign(target, stateSlice, dispatch);
    }
  }

  shallowEqual(objA, objB) {
    if (objA === objB) {
      return true;
    }

    /* $$hashKey is added by angular when using ng-repeat, we ignore that*/
    const keysA = Object.keys(objA).filter(k => k !== '$$hashKey');
    const keysB = Object.keys(objB).filter(k => k !== '$$hashKey');

    if (keysA.length !== keysB.length) {
      return false;
    }

    // Test for A's keys different from B.
    const hasOwn = Object.prototype.hasOwnProperty;
    for (let i = 0; i < keysA.length; i += 1) {
      if (!hasOwn.call(objB, keysA[i]) ||
        objA[keysA[i]] !== objB[keysA[i]]) {
        return false;
      }
    }

    return true;
  }
}
