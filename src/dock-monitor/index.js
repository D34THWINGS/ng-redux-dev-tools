import {module} from 'angular';

import ngReduxDevToolsServices from '../dev-tools-services';

import dockMonitorDirective from './dock-monitor-directive/dock-monitor-directive';
import {DockMonitorController} from './dock-monitor-directive/dock-monitor-controller';

import reducer from './reducer';

export default module('ngDockMonitor', [ngReduxDevToolsServices])

  .directive('dockMonitor', dockMonitorDirective)
  .controller('DockMonitorController', DockMonitorController)

  .config(function (devToolsServiceProvider) {
    'ngInject';

    devToolsServiceProvider.registerReducer(reducer);
  })

  .name;
