// 清理过期图片
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");

// 导入配置文件
const { installConfig } = require("../config/config");
const { baseConfig } = require("../data/config");

// 初始化配置项
const { surviveDays, retryTimeout } = baseConfig;
const { dir, databaseTable } = installConfig;

// 导入模块
const { logger } = require("./log4js"); 
const { operateDb } = require("./conn"); 
const { delDirectory } = require("./fileOperations");
const { eventBus } = require("./eventBus"); 

// 错误收集器
let errorList = []; 
let retryTime = 0; 
eventBus.on("on-error", (error) => {
    errorList.push(error);
});

/**
 * 自定义安全清理函数：解决 ENOTDIR 并支持清理以前的所有日期
 */
const cleanFileSystem = (targetDir, thresholdDate) => {
    if (!fs.existsSync(targetDir)) return;

    // 获取目录下所有项（年/月/日）
    const items = fs.readdirSync(targetDir);

    items.forEach(item => {
        const fullPath = path.join(targetDir, item);
        const stats = fs.statSync(fullPath);

        // 核心防御：只有是目录时才继续往下走
        if (stats.isDirectory()) {
            const relative = path.relative(dir, fullPath).split(path.sep);
            
            if (relative.length === 3) {
                // 到达 YYYY/MM/DD 层级
                const [y, m, d] = relative;
                const folderDate = dayjs(`${y}-${m}-${d}`);

                // 满足“当天及以前”则删除
                if (folderDate.isValid() && (folderDate.isBefore(thresholdDate, 'day') || folderDate.isSame(thresholdDate, 'day'))) {
                    try {
                        delDirectory(fullPath);
                        logger.info(`已清理过期目录: ${fullPath}`);
                    } catch (e) {
                        eventBus.emit("on-error", e.message);
                    }
                }
            } else {
                // 还没到日期层级（年或月），继续递归
                cleanFileSystem(fullPath, thresholdDate);
                
                // 递归回来后，如果文件夹空了，就删掉空目录 (替代原版 rmEmptyDir)
                if (fs.readdirSync(fullPath).length === 0) {
                    fs.rmdirSync(fullPath);
                }
            }
        } else {
            // 如果在资源根目录下发现了孤立文件，且它不是目录，直接忽略或按需删除
            // 这样就永远不会对文件执行 readdir，彻底解决 ENOTDIR
        }
    });
};

const deleteExpired = async () => {
    if (surviveDays <= 0) return; 

    // 计算过期的截止日期（当天）
    const expiredDate = dayjs().subtract(surviveDays, 'day');
    const dateLimitStr = expiredDate.format("YYYY-MM-DD");

    try {
        logger.info(`开始清理任务: 目标日期 <= ${dateLimitStr}`);

        // 1. 安全地执行文件系统清理（解决 ENOTDIR 并清理所有历史）
        cleanFileSystem(dir, expiredDate);

        // 2. 清理数据库数据 (使用 <= 清理以前的所有数据)
        const SQL_DELETE = `DELETE FROM ${databaseTable} WHERE date <= '${dateLimitStr}';`;
        await operateDb(SQL_DELETE, null);
        logger.info("数据库-(清理)完成");

    } catch (err) {
        eventBus.emit("on-error", err.message);
    }

    // 重试逻辑 (保持原版风格)
    if (errorList.length === 0) {
        logger.info("清理任务成功");
        retryTime = 0; // 成功后重置计数器
    } else {
        if (retryTime >= 3) {
            logger.error("清理任务最终失败: " + errorList.join(' | '));
            retryTime = 0;
            errorList = [];
            return;
        }
        retryTime++;
        logger.error(`发生了错误，准备重试... 次数: ${retryTime}`);
        errorList = [];
        setTimeout(function () {
            deleteExpired();
        }, retryTimeout);
    }
};

// 执行
deleteExpired();