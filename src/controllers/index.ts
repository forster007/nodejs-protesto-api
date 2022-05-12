import { IndexInterface, IndexModel } from "../models";

class IndexController {
  async save(props: IndexInterface): Promise<IndexInterface> {
    const newIndex = await IndexModel.create(props);
    return newIndex;
  }
}

export default IndexController;
