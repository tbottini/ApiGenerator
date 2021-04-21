module.exports = {
  attrs: require("./api/srcs/attrs"),
  parse: require("./api/srcs/parse/parser"),
  ERROR: require("./api/srcs/parse/error"),
  REGEX: require("./api/srcs/parse/regex"),
  mjml: require("./api/srcs/email/mjml"),
  Model: require("./api/srcs/model")
};
