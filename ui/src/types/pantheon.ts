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
  cid: string;
  name: string;
  tags: ScryTag[];
}

/*****************************/
/* Poke Types (React->Urbit) */
/*****************************/

export interface PokeKey extends ScryKey {}

// export interface PokeBoard {
//   name: string;
//   desc: string;
//   tags: string[];
//   image: string;
//   axis: Axis;
// }
//
// export interface PokeJoin {
//   host: string;
//   name: string;
// }

/////////////////
// Route Types //
/////////////////

// export interface SearchRoute extends Record<string, string | undefined> {
//   planet?: string;
//   board?: string;
//   lookup?: string;
//   // limit?: string;
//   // page?: string;
// }

/////////////////////
// Interface Types //
/////////////////////

// export type SetThreadAPI = 'set-best' | 'unset-best' | 'vote-up' | 'vote-dn';
// export type SetPermsAPI = 'toggle' | 'ban' | 'unban' | 'allow';
