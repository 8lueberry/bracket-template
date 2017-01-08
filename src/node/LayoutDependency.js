export default class LayoutDependency {
  constructor() {
    this.master = null;
    this.partials = new Map();
  }

  hasMaster() {
    return !!this.master;
  }

  /**
   * Checks whether it has a circular dependency
   */
  hasCircular() {
    // TODO

    if (this.master) {
      return false;
    }

    return false;
  }

  /**
   * Retrieves the list of paths
   */
  getFileDependencies() {
    return this.partials.reduce(
      (res, p) => res.concat(p.path),
      this.master ? [this.master.path] : [],
    );
  }
}
