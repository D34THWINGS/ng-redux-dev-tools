import angular from 'angular';

import ngDockMonitor from './dock-monitor';
import ngLogMonitor from './log-monitor';

export {ActionCreators} from './dev-tools-services/actions';

export default angular.module('ngReduxDevTools', [ngDockMonitor, ngLogMonitor])
  .name;
