/* eslint complexity: 0, max-statements: 0 */

export class LogMonitorJSONController {
  constructor($scope) {
    'ngInject';

    this.isExpandable = true;
    this.key = `${$scope.key}:`;
    this.value = $scope.value;
    this.showedValue = $scope.value;
    this.startExpanded = $scope.startExpanded;

    this.classModifier = LogMonitorJSONController.whatClass(this.value).toLowerCase();

    const isObject = LogMonitorJSONController.is(this.value, 'Object');
    const isArray = LogMonitorJSONController.is(this.value, 'Array');
    if (!isObject && !isArray) {
      this.isExpandable = false;

      if (LogMonitorJSONController.is(this.value, 'String')) {
        this.showedValue = `"${this.value}"`;
      }

      if (LogMonitorJSONController.is(this.value, 'Null')) {
        this.showedValue = 'null';
      }

      if (LogMonitorJSONController.is(this.value, 'Undefined')) {
        this.showedValue = 'undefined';
      }

      return;
    }

    if (Object.keys(this.value).length === 0) {
      this.isExpandable = false;
      this.showedValue = isArray ? '[]' : '{}';
      return;
    }

    // Setup preview text
    this.preview = LogMonitorJSONController.makePreviewText(this.value);

    // Setup isExpanded state handling
    this.isExpanded = this.startExpanded ? this.startExpanded() : false;
  }

  getNodeClass() {
    const baseClass = `log-monitor__json--${this.classModifier}`;
    const expandableClass = this.isExpandable ? ' expandable' : '';
    const expandedClass = this.isExpanded ? ' expanded' : '';
    return baseClass + expandableClass + expandedClass;
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  static makePreviewText(value) {
    const isArray = LogMonitorJSONController.is(value, 'Array');

    if (isArray) {
      return `[] ${value.length} ${LogMonitorJSONController.pluralize(value.length, 'item')}`;
    }

    const keys = Object.keys(value);
    return `{} ${keys.length} ${LogMonitorJSONController.pluralize(keys.length, 'key')}`;
  }

  static pluralize(value, str) {
    return value > 1 ? `${str}s` : str;
  }

  static whatClass(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
  }

  static is(obj, type) {
    return Object.prototype.toString.call(obj).slice(8, -1) === type;
  }
}
