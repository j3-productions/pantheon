import React, { useState, useContext } from 'react';
import type {
  LoaderFunction as RRDLoaderFun,
  ShouldRevalidateFunction as RRDRevalidateFun,
} from 'react-router';
import { redirect, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { KeyProvider, useKey } from './components/KeyContext';

import api from './api';
import { KeyEntry, AppConfig } from './pages/Forms';
import { Gallery } from './pages/Views';

import { decodeQueryParams, encodeQueryParams, getSlateSource } from './utils';
import * as Type from './types/pantheon';
import * as Const from './constants';

///////////////////////////
/// Component Functions ///
///////////////////////////

export function App() {
  return (
    <KeyProvider>
      <AppRouter />
    </KeyProvider>
  );
}

//////////////////////
// Helper Functions //
//////////////////////

// NOTE: This needs to be a light wrapper around 'RouterProvider' so that it
// can use the 'KeyProvider'/'KeyContext' React Context (only usable within
// components).
const AppRouter = () => {
  const [key, resetKey] = useKey();

  const loadBase: RRDLoaderFun = async ({request}) => {
    const url: string = (new URL(request.url)).pathname;
    if(key === undefined) {
      return 0;
    } else if(key === "" && !url.match(Const.KEY_PATH_REGEX)) {
      return redirect(Const.KEY_PATH);
    } else if(key !== "" && !url.match(Const.GALLERY_PATH_REGEX)) {
      return redirect(Const.GALLERY_PATH);
    } else {
      return 0;
    }
  };

  const loadGallery: RRDLoaderFun = async ({request}) => (
    api.poke<any>({
      app: "pantheon-agent",
      mark: "pantheon-action",
      json: {"sync-files": {"merge": "theirs"}},
    }).then((result: number) =>
      new Promise(resolve => {
        setTimeout(resolve, 2000);
        return result;
      })
    ).then((result: any) => {
      const queryString = new URL(request.url).searchParams.get("q");
      const queryParams: Type.QueryParams = decodeQueryParams(queryString || "///");
      return api.scry<Type.ScryFile[]>({
        app: "pantheon-agent",
        path: (typeof queryString !== "string") ?
          "/files" :
          // FIXME: This works for all simple query parameters, but once
          // you add spaces or question marks to 'name', all bets are off.
          "/search/" + encodeQueryParams(queryParams) + "%2F"
      })
    })
  );
  // NOTE: Only reload gallery data when (1) navigating from another URL,
  // (2) submitting a different search query, or (3) uploading a file.
  const reloadGallery: RRDRevalidateFun = ({currentUrl, nextUrl}) => (
    (currentUrl.pathname !== nextUrl.pathname) ||
    (currentUrl.searchParams.get("q") !== nextUrl.searchParams.get("q")) ||
    (currentUrl.searchParams.get("u") !== nextUrl.searchParams.get("u"))
  );

  return (
    <RouterProvider router={createBrowserRouter([
      {
        path: Const.APP_PATH,
        loader: loadBase,
        children: [
          {
            path: Const.KEY_PATH.split("/").slice(-1)[0],
            element: <KeyEntry />,
          },
          {
            path: Const.CONFIG_PATH.split("/").slice(-1)[0],
            element: <AppConfig />,
          },
          {
            path: Const.GALLERY_PATH.split("/").slice(-1)[0],
            loader: loadGallery,
            shouldRevalidate: reloadGallery,
            element: <Gallery />,
          },
        ],
      },
    ])} />
  );
};
