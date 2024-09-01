import Joi from 'joi';

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  genre: Joi.string(),
  publishedDate: Joi.date()
});

const validateBook = (data) => {
  return bookSchema.validate(data);
};

export  { validateBook };
