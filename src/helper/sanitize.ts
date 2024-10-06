import validator from "validator";
import {ListUserDto} from "../dto/ListUserDto";


function sanitizeUsername(input: string): string {
  return validator
    .whitelist(input, 'a-zA-Z0-9-')
    .toLowerCase();
}


function sanitizeFilter(filter: ListUserDto): ListUserDto {

  const sanitize = (input: string | null): null | string => {
    if (!input || !(input?.trim())) return null;

    return validator
      .whitelist(input, 'a-zA-Z0-9!@#$%^&*()-+')
      .trim()
      .toLowerCase();
  }

  return {
    location: sanitize(filter.location),
    technology: sanitize(filter.technology),
  };
}

export {
  sanitizeFilter,
  sanitizeUsername,

}