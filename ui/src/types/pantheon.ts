/////////////////////
// Interface Types //
/////////////////////

/*******************************/
/* Internal Types (React only) */
/*******************************/

// export interface Key {
//   key: string;
// }

// export interface Board {
//   name: string;
//   desc: string;
//   tags: string[];
//   image: string;
//   host: string;
// }

/****************************/
/* Scry Types (Urbit->React) */
/****************************/

export interface ScryKey {
  key: string;
}

export interface ScryTag {
  id: string;
  name: string;
  slatename: string;
}

export interface ScryFile {
  owner: string;
  privacy: PrivacySetting;
  cid: string;
  name: string;
  tags: ScryTag[];
  type: string;
  islink: boolean;
}

export interface ScryFiles {
  [key: string]: ScryFile;
}

/*****************************/
/* Poke Types (React->Urbit) */
/*****************************/

export interface PokeKey extends ScryKey {}

export interface PokeSync {
  "merge-strategy": MergeType;
}

export interface PokeEdit {
  "slate-id": string;
  cid: string;
  priv: PrivacySetting;
  name: string;
}

/////////////////
// Other Types //
/////////////////

export type QueryParams = [string, string, string, string];

export type MergeType = "ours" | "theirs" | "union" | "intersect";
export type GalleryMode = "simple" | "detail";
export type PrivacySetting = "private" | "pals" | "public";
export type PrivacyFilter = PrivacySetting | "";

export interface FieldOption {
  readonly label: string;
  readonly value: string;
}
