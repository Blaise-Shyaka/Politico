const sendResponse = (def, code, message) => {
  return def.status(code).json({ status: def.statusCode, error: message });
};

export default sendResponse;
