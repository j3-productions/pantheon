export const APP_TAG_NAME: string = "urbit-pantheon";

export const APP_PATH: string = "/apps/pantheon/";
export const ASSET_PATH: string = APP_PATH + "src/assets/";
export const KEY_PATH: string = APP_PATH + "key";
export const GALLERY_PATH: string = APP_PATH + "gal";
export const CONFIG_PATH: string = APP_PATH + "cfg";

export const KEY_REGEX: RegExp =
  /^SLA([a-f0-9]{8})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{12})TE$/;
export const ASSET_PATH_REGEX: RegExp = new RegExp(`${ASSET_PATH}.*`);
export const KEY_PATH_REGEX: RegExp = new RegExp(`${KEY_PATH}.*`);
export const GALLERY_PATH_REGEX: RegExp = new RegExp(`${GALLERY_PATH}.*`);
export const CONFIG_PATH_REGEX: RegExp = new RegExp(`${CONFIG_PATH}.*`);

export const API_BASE_PATH: string = "https://slate.host/api/v3/";
export const API_UPLOAD_PATH: string = "https://uploads.slate.host/api/v3/public/";
