import * as joi from 'joi';
import * as dotenv from 'dotenv';

process.env.ENV_PATH
  ? dotenv.config({ path: process.env.ENV_PATH })
  : dotenv.config();

const envSchema = joi
  .object({
    NODE_ENV: joi.string().valid('development', 'staging').required(),
    HTTP_PORT: joi.string().required(),
    SECRET_KEY: joi.string(),
  })
  .unknown()
  .required();

const { error, value: envVal } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Configuration error for env schema ${error.message}`);
}

export const configs = {
  port: {
    http_port: envVal.HTTP_PORT,
  },
  node_env: envVal.NODE_ENV,
  secret: envVal.SECRET_KEY,
};
