import { DataTypes } from "sequelize";

export default(sequelize)=>{
    const Dailyreport =sequelize.define("daily_report",{

        id:{
            type:DataTypes.STRING(36),
            allowNull:false,
            primaryKey: true,
            validate:{
                notEmpty: true
            }
        },
        sale_date:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:DataTypes.NOW

        },
        total_profit:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notEmpty:true,
                isNumeric:true
             }   
            
        },
        total_sale:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notEmpty:true,
                isNumeric:true
             }   
            
        },
        total_quantity:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notEmpty:true,
                isNumeric:true
            }
        },
        created_at:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:DataTypes.NOW

        },
    },
    
        {
            tableName: "daily_report",
            timestamps: true,
            underscored: true   

    });

    return Dailyreport
}