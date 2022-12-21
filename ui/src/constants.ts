export const APP_PATH: string = "/apps/pantheon/";
export const KEY_PATH: string = APP_PATH + "key";
export const API_PATH: string = APP_PATH + "api";

export const KEY_REGEX: RegExp =
  /^SLA([a-f0-9]{8})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{12})TE$/;
export const KEY_PATH_REGEX: RegExp = new RegExp(`${KEY_PATH}.*`);
export const API_PATH_REGEX: RegExp = new RegExp(`${API_PATH}.*`);
