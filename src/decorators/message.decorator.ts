import { SetMetadata } from '@nestjs/common';
import { MESSAGE_KEY } from 'src/constants/constant';

export const Message = (message: string) => SetMetadata(MESSAGE_KEY, message);
