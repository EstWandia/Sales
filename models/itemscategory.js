import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from 'uuid';

export default (sequelize) => {
  const Itemscategory = sequelize.define("items_category", {
    id: {
      type: DataTypes.STRING(36),
      defaultValue: uuidv4,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isNumeric: true,
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: "items_category",
    timestamps: true,
    underscored: true,
  });

  return Itemscategory;
};
