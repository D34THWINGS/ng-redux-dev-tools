import {module} from 'angular';

import {DevToolsServiceProvider} from './dev-tools-service-provider';
import {DevToolsActionCreatorsService} from './dev-tools-action-creators-service';

export default module('ngReduxDevToolsServices', ['ngRedux'])

  .provider('devToolsService', DevToolsServiceProvider)
  .service('devToolsActionCreatorsService', DevToolsActionCreatorsService)

  .name;
