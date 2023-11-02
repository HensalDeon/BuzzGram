import Joi from "joi"

//signup
const signupSchema = Joi.object({
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().length(10).required(),
  password: Joi.string().required(),
  confirmpassword: Joi.string().required(),
  otp: Joi.string().required(),
  checkbox: Joi.optional(),
});

//reset password
const resetPasswordSchema = Joi.object({
  password: Joi.string().trim().max(30).optional()
})

//add-coupon
const couponValidationSchema = Joi.object({
  couponname: Joi.string().required().trim().min(2).max(100).messages({
    'any.required': 'Coupon Name is required',
    'string.empty': 'Coupon Name cannot be empty',
  }),
  couponDescription: Joi.string().required().trim().min(5).max(300).messages({
    'any.required': 'Coupon Description is required',
    'string.empty': 'Coupon Description cannot be empty',
  }),
  discount: Joi.number().required().min(0).messages({
    'any.required': 'Discount is required',
    'number.base': 'Discount must be a number',
    'number.min': 'Discount cannot be negative',
  }),
  minimumPurchase:Joi.number().required().min(0).messages({
    'any.required': 'Minimum purachase amount is required',
    'number.base': 'Minimum purachase amount must be a number',
    'number.min': 'Minimum purachase amount cannot be negative',
  }),
  validFrom: Joi.date().required().messages({
    'any.required': 'Valid From date is required',
    'date.base': 'Valid From must be a valid date',
  }),
  validUntil: Joi.date().required().messages({
    'any.required': 'Valid Until date is required',
    'date.base': 'Valid Until must be a valid date',
  }),
}).custom((value, helpers) => {
  if (value.validFrom && value.validUntil && value.validFrom >= value.validUntil) {
    return helpers.error('date.startEnd', { message: 'Valid From must be less than Valid Until' });
  }
  return value;
}).messages({
  'date.startEnd': 'Valid From must be less than Valid Until',
});

module.exports = {
  signupSchema,
  addProductSchema,
  addressSchema,
  updateUserSchema,
  updateProductSchema,
  couponValidationSchema,
  resetPasswordSchema
};
