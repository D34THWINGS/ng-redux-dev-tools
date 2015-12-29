import angular from 'angular';
import parseKey from 'parse-key';

import dockMonitorDirectiveTemplate from './dock-monitor-directive.html';

export default function dockMonitorDirective($window, $document) {
  'ngInject';

  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: dockMonitorDirectiveTemplate,
    scope: {},
    bindToController: {
      toggleVisibilityKey: '='
    },
    controllerAs: 'dockMonitorCtrl',
    controller: 'DockMonitorController',
    link(scope, elem) {
      const $hook = angular.element(elem[0].querySelector('.dock-monitor__resize-hook'));

      function matchesKey(key, event) {
        const charCode = event.keyCode || event.which;
        const char = String.fromCharCode(charCode);
        return key.name.toUpperCase() === char.toUpperCase() &&
          key.alt === event.altKey &&
          key.ctrl === event.ctrlKey &&
          key.meta === event.metaKey &&
          key.shift === event.shiftKey;
      }

      function mouseMoveListener(e) {
        elem.css('width', `${$window.innerWidth - e.pageX}px`);
        e.preventDefault();
      }

      function mouseUpListener() {
        $document.off('mousemove', mouseMoveListener);
      }

      function mouseDownListener(e) {
        $document
          .on('mousemove', mouseMoveListener)
          .on('mouseup', mouseUpListener);
        e.preventDefault();
      }

      function keyDownListener(e) {
        const visibilityKey = parseKey(scope.dockMonitorCtrl.toggleVisibilityKey || 'ctrl-h');

        if (matchesKey(visibilityKey, e)) {
          scope.dockMonitorCtrl.toggleVisibility();
          scope.$digest();
          e.preventDefault();
        }
      }

      $hook.on('mousedown', mouseDownListener);
      $document.on('keydown', keyDownListener);
    }
  };
}
