import {module} from 'angular';
import 'angular-recursion';

import logMonitorBtnDirective from './log-monitor-button-directive/log-monitor-button-directive';

import logMonitorDirective from './log-monitor-directive/log-monitor-directive';
import {LogMonitorController} from './log-monitor-directive/log-monitor-controller';

import logMonitorEntryDirective from './log-monitor-entry-directive/log-monitor-entry-directive';
import {LogMonitorEntryController} from './log-monitor-entry-directive/log-monitor-entry-controller';

import logMonitorJSONDirective from './log-monitor-json-directive/log-monitor-json-directive';
import {LogMonitorJSONController} from './log-monitor-json-directive/log-monitor-json-controller';

import ngReduxDevToolsServices from '../dev-tools-services';

export default module('ngReduxDevTools.logMonitor', [ngReduxDevToolsServices, 'RecursionHelper'])

  .directive('logMonitor', logMonitorDirective)
  .directive('lmButton', logMonitorBtnDirective)
  .directive('lmEntry', logMonitorEntryDirective)
  .directive('lmJson', logMonitorJSONDirective)

  .controller('LogMonitorController', LogMonitorController)
  .controller('LogMonitorEntryController', LogMonitorEntryController)
  .controller('LogMonitorJSONController', LogMonitorJSONController)

  .name;
