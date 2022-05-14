import { ProtestoInterface, ProtestoModel } from "../models/protestoModel";

class ProtestoController {
  async save(props: ProtestoInterface): Promise<ProtestoInterface> {
    const newIndex = await ProtestoModel.create(props);
    return newIndex;
  }

  async findById(tituloId: string): Promise<ProtestoInterface> {
    return await ProtestoModel.findOne({ tituloId });
  }

  async findByIdAndUpdate(tituloId: string, update: ProtestoInterface): Promise<ProtestoInterface> {
    return await ProtestoModel.findOneAndUpdate({ tituloId }, update);
  }
}

export default ProtestoController;
