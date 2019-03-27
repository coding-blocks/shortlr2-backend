import Sequelize, { DefineModelAttributes, Model } from 'sequelize'

export function defineModel<IAttributes>(
  sequelize: Sequelize.Sequelize,
  modelName: string,
  attributes: DefineModelAttributes<IAttributes>,
): Sequelize.Model<Sequelize.Instance<IAttributes> & IAttributes, IAttributes> {
  return sequelize.define(modelName, attributes)
}
