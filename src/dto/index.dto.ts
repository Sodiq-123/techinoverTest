import { BaseDto } from './base.dto';

export const validatePayload = async (dto: BaseDto) => {
  const errors = await dto.validate();
  if (errors.length > 0) {
    return {
      status: 'error',
      message: 'Invalid payload',
      errors,
    };
  }
  return {
    status: 'success',
  };
};
