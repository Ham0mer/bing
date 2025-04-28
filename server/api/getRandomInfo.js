// 导入配置文件
const {
    installConfig,
} = require("../config/config");

// 初始化配置项
const { databaseTable } = installConfig;

// 导入模块
const { logger } = require("../model/log4js"); // 日志模块
const { operateDb } = require("../model/conn"); // 数据库模块
const { reduceRes } = require("../utils/reduceRes");
const dayjs = require("dayjs");

// 获取随机数据信息
const getRandomInfo = (req, res) => {
    const startDate = dayjs('2023-11-03');
    const today = dayjs();
    const randomDate = dayjs(startDate).add(Math.floor(Math.random() * today.diff(startDate, 'day')), 'day');
    
    const SQL_GET_RANDOM_INFO = `SELECT * FROM ${databaseTable} WHERE date='${randomDate.format('YYYY-MM-DD')}'`;
    const info = operateDb(SQL_GET_RANDOM_INFO, null);
    
    Promise.all([info])
        .then((values) => {
            if (values[0].data && values[0].data.length > 0) {
                res.send({
                    info: reduceRes(values[0].data)[0],
                });
            } else {
                res.send({
                    message: '未找到该日期的数据',
                });
            }
        })
        .catch((err) => {
            logger.error("获取随机数据信息时发生错误: " + err);
            res.send({
                message: "获取随机数据信息时发生错误",
                error: err
            });
        });
}

module.exports = {
    getRandomInfo,
}; 