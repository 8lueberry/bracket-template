import bracket from '../bracket';

class LayoutHelper {
  constructor({ store }) {
    if (!store) {
      throw new Error('Expected a store to be provided');
    }
    this.store = store;
  }

  /**
   * Renders a partial file
   */
  partial(filepath, partialModel) {
    const tmpl = this.store.get(filepath);
    const template = bracket.compile(tmpl);
    const result = template(partialModel);
    return result;
  }
}

export default LayoutHelper;
