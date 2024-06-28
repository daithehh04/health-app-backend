const validStatuses = ['pending', 'accepted', 'rejected'];

function isValidStatus(status) {
     return validStatuses.includes(status);
}
module.exports = isValidStatus;