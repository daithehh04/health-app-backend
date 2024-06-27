const { SuccessResponse, CREATED } = require("../core/success.response.js");
const BookAppointmentService = require("../services/book-appointment.service.js");
const { BookAppointment, Doctor, User } = require("../models/index");
const { Op } = require("sequelize");
class BookAppointmentController {
     static getAllBookAppointment = async (req, res) => {
          new SuccessResponse({
               message: "Get all BookAppointment Success!",
               data: await BookAppointmentService.getAllBookAppointment(req.query),
          }).send(res)
     }
     static createBookAppointment = async (req, res) => {
          const { doctorId, userId, startTime, endTime } = req.body;
          console.log('req.body', req.body);
          const response = {};
          try {
               const doctorFind = await Doctor.findByPk(doctorId);
               const userFind = await User.findByPk(userId);
               if (!doctorFind) {
                    return res.status(404).json({ status: 404, message: "Bác sĩ  không tồn tại!" });
               }
               if (!userFind) {
                    return res.status(404).json({ status: 404, message: "Tài khoản không tồn tại!" });
               }
               const start = new Date(startTime);
               const end = new Date(endTime);
               if (start >= end) {
                    return res.status(400).json({ status: 400, message: "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!" });
               }
               const existingAppointments = await BookAppointment.findOne({
                    where: {
                         doctor_id: doctorId,
                         [Op.or]: [
                              {
                                   start_time: {
                                        [Op.between]: [start, end],
                                   },
                              },
                              {
                                   end_time: {
                                        [Op.between]: [start, end],
                                   },
                              },
                              {
                                   [Op.and]: [
                                        {
                                             start_time: {
                                                  [Op.lte]: start,
                                             },
                                        },
                                        {
                                             end_time: {
                                                  [Op.gte]: end,
                                             },
                                        },
                                   ],
                              },
                         ],
                    },
               });
               if (existingAppointments) {
                    return res.status(409).json({ status: 409, message: "Bác sĩ đã có lịch hẹn trong khoảng thời gian này!" });
               }
               await userFind.addDoctor(doctorFind,
                    {
                         through:
                         {
                              start_time: startTime,
                              end_time: endTime
                         }
                    });
               response.status = 201;
               response.message = "Đặt lịch thành công"

          } catch (e) {
               response.status = 500;
               response.message = e?.message;
          }
          return res.status(response.status).send(response);
     }
}

module.exports = BookAppointmentController