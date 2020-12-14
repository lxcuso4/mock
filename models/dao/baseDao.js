/**
 * @项目名称: mock
 * @功能名称:
 * @文件名称: baseDao
 * @Date: 2020/3/3
 * @Author: liux
 *
 */
class BaseDao {
    /**
     * 子类构造传入对应的 Model 类
     *
     * @param Model
     */
    constructor(Model) {
        this.Model = Model;
    }


    /**
     * 使用 Model 的 静态方法 create() 添加 doc
     *
     * @param obj 构造实体的对象
     * @returns {Promise}
     */
    async create() {
        return await this.Model.create(...arguments)
    }


    /**
     * 使用 Model save() 添加 doc
     *
     * @param obj 构造实体的对象
     * @returns {Promise}
     */
    async save(obj) {
        var doc = new this.Model(obj)
        return doc.save();
    }


    /**
     * 查询所有符合条件 docs
     *
     * @param condition 查找条件
     * @param constraints
     * @returns {Promise}
     */
    async find(condition, constraints) {
        return await this.Model.find(condition, constraints).exec()
    }


    /**
     * 查找符合条件的第一条 doc
     *
     * @param condition
     * @param constraints
     * @returns {Promise}
     */
    async findOne(condition, constraints) {
        return await this.Model.findOne(condition,constraints).exec()
    }


    /**
     * 更新 docs
     *
     * @param condition 查找条件
     * @param obj 更新数据
     * @returns {Promise}
     */
    async updateOne(condition, obj) {
        return await this.Model.updateOne(condition, obj).exec()
    }

    /**
     * 移除 第一个doc
     *
     * @param condition 查找条件
     * @returns {Promise}
     */
    async deleteOne(condition){
        return await this.Model.deleteOne(condition)
    }

    /**
     * 移除 所有匹配doc
     *
     * @param condition 查找条件
     * @returns {Promise}
     */
    async deleteMany(condition) {
        return await this.Model.deleteMany(condition)
    }

}


module.exports = BaseDao;
