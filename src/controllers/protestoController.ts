import { ProtestoInterface, ProtestoModel } from "../models/protestoModel";

class ProtestoController {
  async save(props: ProtestoInterface): Promise<ProtestoInterface> {
    const newIndex = await ProtestoModel.create(props);
    return newIndex;
  }

  async findById(props: { id: number }): Promise<ProtestoInterface> {
    return await ProtestoModel.findOne({ "response.id": props.id });
  }

  async findByIdAndUpdate(props: { id: number; update: ProtestoInterface }): Promise<ProtestoInterface> {
    return await ProtestoModel.findOneAndUpdate({ "response.id": props.id }, props.update);
  }
}

export default ProtestoController;
