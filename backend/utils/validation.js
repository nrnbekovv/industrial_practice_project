const Joi = require('joi');

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const taskValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    status: Joi.string().valid('pending', 'completed'),
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  taskValidation,
};