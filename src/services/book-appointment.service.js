

const { NotFoundError, BadRequestError } = require("../core/error.response");
const { BookAppointment, Doctor, User } = require("../models/index");
class BookAppointmentService {
     static getAllBookAppointment = async ({ page, limit, userId }) => {
          const options = {
               include: [
                    {
                         model: Doctor
                    },
               ],
               order: [["created_at", "desc"]],

          }
          if (userId) {
               options.where = {
                    user_id: userId
               }
          }
          if (!+page || page < 0) {
               page = 1
          }

          if (limit && Number.isInteger(+limit)) {
               options.limit = limit
               const offset = (page - 1) * limit
               options.offset = offset
          }
          const { rows: appointmentsResult, count } = await BookAppointment.findAndCountAll(options);
          const appointments = appointmentsResult.map(appointment => ({
               doctor: {
                    id: appointment.Doctor.id,
                    name: appointment.Doctor.name,
                    image: appointment.Doctor.image,
                    address: appointment.Doctor.address,
                    phone: appointment.Doctor.phone,
                    exp: appointment.Doctor.exp,
                    price: appointment.Doctor.price,
               },
               startTime: appointment.start_time,
               endTime: appointment.end_time,

          }));
          return {
               appointments,
               count,
          }
     }
}

module.exports = BookAppointmentService