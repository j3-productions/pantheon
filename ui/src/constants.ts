export const APP_PATH: string = "/apps/pantheon/";
export const KEY_PATH: string = APP_PATH + "key";
export const CONFIG_PATH: string = APP_PATH + "cfg";
export const GALLERY_PATH: string = APP_PATH + "gal";

export const KEY_REGEX: RegExp =
  /^SLA([a-f0-9]{8})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{12})TE$/;
export const KEY_PATH_REGEX: RegExp = new RegExp(`${KEY_PATH}.*`);
export const CONFIG_PATH_REGEX: RegExp = new RegExp(`${CONFIG_PATH}.*`);
export const GALLERY_PATH_REGEX: RegExp = new RegExp(`${GALLERY_PATH}.*`);
