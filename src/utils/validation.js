export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const data = req[property]; // body | params | query

    const { error } = schema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        details: error.details.map((err) => err.message),
      });
    }

    next();
  };
};
