/////////////////////
// Interface Types //
/////////////////////

/*******************************/
/* Internal Types (React only) */
/*******************************/

export interface Key {
  key: string;
}

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

// export type ScryBoards = {
//   'all-boards': {
//     boards: Omit<Board, 'host'>[];
//     host: string;
//   }[];
// };
//
// export type ScryQuestions = {
//   questions: ScryQuestion[];
// };
//
// export type ScryThread = ScryQuestion & {
//   answers: ScryAnswer[];
//   best: number | undefined;
// };

/*****************************/
/* Poke Types (React->Urbit) */
/*****************************/

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
