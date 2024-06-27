const { User } = require('../models/index');
class UserService {
  static getAllUsers = async ({ page, limit }) => {
    const options = {
      order: [["created_at", "desc"]],

    }
    if (!+page || page < 0) {
      page = 1
    }

    if (limit && Number.isInteger(+limit)) {
      options.limit = limit
      const offset = (page - 1) * limit
      options.offset = offset
    }

    const { rows: doctors, count } = await User.findAndCountAll(options)
    return {
      doctors,
      count,
    }
  }

  static getUserDetail = () => {

  }
}
module.exports = UserService