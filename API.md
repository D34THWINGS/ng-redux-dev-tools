API Reference
=============

- Services
  - devToolsApiServiceProvider
  - devToolsApiService
  - devToolsActionCreatorsService
- Directives
  - logMonitor
  - dockMonitor

## Services

### devToolsApiServiceProvider

#### `instrument()`

Creates a store enhancer (function) to allow the dev tools to process your actions and states.

```js
$ngReduxProvider.createStoreWith(reducer, [], [devToolsServiceProvider.instrument()]);
```

#### `persistState(key)`

Creates a store enhancer that persists the state into the local storage using a specific key.
- `key` (*String*): The key you want to store your data with. You can get it from a url query parameter allowing you to persist multiple states for specific state testing.

```js
$ngReduxProvider.createStoreWith(reducer, [], [
  devToolsServiceProvider.instrument(),
  devToolsServiceProvider.persistState('foo')
]);
```

### devToolsApiService

#### `connect([mapStateToTarget, [mapDispatchToTarget]])(target)`

Creates a connector to the dev tools store (not the store created by ngRedux). This store hols the status of the tools without polluting the store you are using for your application. The dev tool store is a pure redux store. 

- [`mapStateToTarget`] \(*Function*): Optional. `connect` will subscribe to dev tools store updates. Any time it updates, `mapStateToTarget` will be called with the `state`. It must return a plain object that will be assigned to `target`. If you have a component which simply triggers actions without needing any state you can pass null to `mapStateToTarget`.
- [`mapDispatchToTarget`] \(*Function*): Optional. The passed function will be given dispatch. The function must return an object that uses dispatch to bind action creators. (Tip: you may use the [bindActionCreators()](http://rackt.org/redux/docs/api/bindActionCreators.html) helper from Redux.).

*You then need to invoke the function a second time, with target as parameter:*

- `target` (*Object* or *Function*): If passed an object, the results of `mapStateToTarget` and `mapDispatchToTarget` will be merged onto it. If passed a function, the function will receive the results of `mapStateToTarget` and `mapDispatchToTarget` as parameters.

Returns a *Function* that will unsubscribe from further updates if called. Remember to watch for scope `$destroy` to unsubscribe controllers.

```js
devToolsApiService.connect(this.mapState, this.mapDispatch)(this);

// Or
devToolsApiService.connect(this.mapState, this.mapDispatch)((selectedState, actions) => {/* ... */});
```

#### `store`

The dev tool store. You can use it to `dispatch` actions, `subscribe` or `getState`.

```js
devToolsApiService.store.dispatch(awesomeActionCreator());
```

### devToolsActionCreatorsService

This service contains all action creators supported by the dev tools by default. These action creators are also available on the root of the package by doing so :

```js
import {ActionCreators} from 'ng-redux-dev-tools';
```

These action creators are:

#### `reset()`

Resets the state to the initial state (state the store was created with) ignoring the saved state and delete all actions.

#### `commit()`

Removes all actions from the log and save the current state into the initial state.

#### `rollback()`

Deletes all actions performed since the last save restoring state to the last save.

#### `sweep()`

Deletes all actions that are skipped.

#### `toggleAction(actionId)`

Toggles an action by marking/un-marking it as skipped. Toggled actions can be removed using `sweep()` action.
- `actionId` (*Number*): The id of the action to toggle. This id must be > 0 as it's not recommended to toggle the `@@INIT` action.

#### `jumpToState(index)`

Sets the current state to given state, does not mark anything as skipped, just moving cursor in memory. Useful for sliders.
- `index` (*Number*): The index of the state to jump to.

#### `importState(nextLiftedState)`

Replaces completely the state with the given state, erasing saves, toggles, actions and states currently in memory.

## Directives

### dockMonitor

Simple docking system that can be toggled on or off. it supports following options :

Attribute               | Description
-------------           | -------------
`default-size`          | A *String* that tells which width the dock will have on initialisation (default: `300px`). Any valid CSS value for `width` is accepted (eg. `px`, `%`, etc)
`default-visible`       | A *Boolean* that tells if the dock should be visible on page load (default: `false`).
`toggle-visibility-key` | A *String* that tells which key combination will toggle on/off the visibility of the dock (default `Ctrl-H`). This key combination will be parsed with [parse-key](https://github.com/thlorenz/parse-key).

This directive supports transclusion so you can put whatever content you want into it.

#### logMonitor

Logging system that displays actions and states. It supports following options :

Attribute               | Description
-------------           | -------------
`select`                | A *Function* that tells which part of state you want to display like `state => state.some.value` (default: `state => state`).
