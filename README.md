Angular Redux DevTools
======================

[![build status](https://img.shields.io/travis/D34THWINGS/ng-redux-dev-tools.svg?style=flat-square)](https://travis-ci.org/D34THWINGS/ng-redux-dev-tools)
[![npm version](https://img.shields.io/npm/v/ng-redux-dev-tools.svg?style=flat-square)](https://www.npmjs.com/package/ng-redux-dev-tools)

The goal of this version of the [Redux DevTools](https://github.com/gaearon/redux-devtools) is to provide a React free developer tools for your Redux/Angular apps, speeding your development build

### Features

- Lets you inspect every state and action payload
- Lets you go back in time by “cancelling” actions

### Overview

The Angular Redux DevTools are largely inspired by [DockMonitor](https://github.com/gaearon/redux-devtools-dock-monitor) and [LogMonitor](https://github.com/gaearon/redux-devtools-log-monitor) with a bit changes to adapt them to the Angular environment. You need to still be careful to not include these tools into production environment. This version is not using the base [Redux DevTools](https://github.com/gaearon/redux-devtools) because it requires to have React in your project. Any suggestions or improvements are welcome. Make sure to follow advices given by [Dan Abramov](https://github.com/gaearon) on Redux DevTools because they basically work basically the same.

### Instalation

```
npm install --save-dev ng-redux-dev-tools
```

### Usage

DevTools are pretty easy to use in Angular, everything you have to do is :

- Import the Angular module `ngReduxDevTools`
- Use the `devToolsServiceProvider.instrument` store enhancer
- Add the monitors you want (`dock-monitor` and `log-monitor` are packaged with the tools) directive to your main HTML file and you're ready to go !

Here's an example :

#### `index.js`

```js

import {module} from 'angular';
import ngRedux from 'ng-redux';
import ngReduxDevTools from 'ng-redux-dev-tools';

import reducer from './reducer';

module('myApp', [ngRedux, ngReduxDevTools])
  .config(function ($ngReduxProvider, devToolsServiceProvider) {
    'ngInject';
    
    $ngReduxProvider.createStoreWith(reducer, [], [devToolsServiceProvider.instrument()]);
  });
  
```

#### `index.html`

```html

<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Angular Redux DevTools</title>
  </head>
  <body ng-app="myApp">
    <dock-monitor>
      <log-monitor></log-monitor>
    </dock-monitor>
  </body>
</html>

```

That's it. Simple ? (The default key to show the DevTools is `Ctrl-H`)

### API

See the [API Reference](API.md).

### Running example

Clone the project:

```
git clone https://github.com/D34THWINGS/ng-redux-dev-tools.git
cd ng-redux-dev-tools
```

Install npm packages in the root folder:

```
npm install
```

Install gulp on your machine if not already present:

```
npm install -g gulp
```

Finally run the following command:

```
gulp serve
```

It's a basic counter example, any changes made to the code (even in the example folder) will reload the browser automatically.

### Custom Monitors

In the Angular version of the tools, it's event simpler to add a new monitor. Here what you need to do :

#### `custom-monitor.js`

```js
// Stupid example that displays all staged actions
angular.module('ngCustomMonitor', ['ngRedux', 'ngReduxDevToolsServices'])
  .directive('customMonitor', function () {
    return {
      restrict: 'E',
      template: '<div class="custom-monitor">{{customMonitorCtrl.stagedActions}}</div>',
      controllerAs: 'customMonitorCtrl',
      controller(devToolsService, devToolsActionCreatorsService, $scope) {
        'ngInject';

        // Connect your controller to the dev tools
        const unsubscribe = devToolsService.connect()(state => state)(this);
        $scope.$on('$destroy', unsubscribe);

        // Do anything you want from here...

        // This is the dev tools store, if you want the application store, use $ngRedux
        this.store = devToolsService.store;

        // Dev tools implements basic action creators (reset, revert, sweep, commit, toggleAction, jumpToState)
        this.reset = function () {
          this.store.dispatch(devToolsActionCreatorsService.reset());
        };
      }
    };
  })
  .config(function (devToolsServiceProvider) {
    'ngInject';

    // Register a custom reducer on the dev tool store allowing us to use redux to manage state of tools
    // without polluting you application state
    devToolsServiceProvider.registerReducer((state, action) => {
      if (action.type === 'FOO') {
        return {foo: 'bar'};
      }

      return state;
    });
  });
```

See this [issue](https://github.com/gaearon/redux-devtools/issues/3) if you want to learn more about what thing are available to you in the dev tool state and what action you can perform

### Licence

MIT
