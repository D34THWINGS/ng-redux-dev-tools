import angular from 'angular';

import ngDockMonitor from './dock-monitor';
import ngLogMonitor from './log-monitor';

export default angular.module('ngReduxDevTools', [ngDockMonitor, ngLogMonitor])
  .name;
