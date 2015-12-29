export class LogMonitorEntryController {
  getEntryTypeClass() {
    return this.collapsed ? 'log-monitor__entry__type--collapsed' : 'log-monitor__entry__type';
  }
}
