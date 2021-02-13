//file with all error message

function errorMsg(msg) {
  return { error: msg };
}

const error = Object.freeze({
  uncomplete: { error: "missing data" },
  unexist: { error: "non-existent resource" },
  formatpassword: {
    error:
      "password to weak : 8 letters min, 1 maj, 1 number and 1 special character"
  },
  formatemail: { error: "wrong email format" },
  formatdate: { error: "wrong date format: YYYY-MM-DD hh:mm:ss" },
  adminRight: { error: "permission denied" },
  attibuteUnexist: { error: "attribute doesn't exist" },
  attrRight: { error: "cannot change this attribute" },
  unlog: { error: "no user logged in" },
  attrMissing: { error: "no attribute provided" },
  valueMissing: { error: "no value provided" },
  fileMissing: { error: "fileMissing" },
  idMissing: errorMsg("id missing"),
  attrUnexist: attr => errorMsg(attr + " attribute doesn't exist"),
  minimumError: min => errorMsg("incorrect value: minimum value is " + min),
  maximumError: max => errorMsg("incorrect value: maximum value is " + max),
  badType: typeRequest =>
    errorMsg("bad type of attribute provide, request : " + typeRequest)
});

module.exports = error;
