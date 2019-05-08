import Sequelize, {
  DefineModelAttributes,
  DefineOptions,
  Instance,
  Model,
} from 'sequelize'

export function defineModel<IAttributes>(
  sequelize: Sequelize.Sequelize,
  modelName: string,
  attributes: DefineModelAttributes<IAttributes>,
  options?: DefineOptions<Instance<IAttributes> & IAttributes> | undefined,
): Sequelize.Model<Instance<IAttributes> & IAttributes, IAttributes> {
  return sequelize.define(modelName, attributes, options)
}
