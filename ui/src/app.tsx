import React, { useState, useContext } from 'react';
import type { LoaderFunctionArgs as RRDLoaderProps } from 'react-router';
import { redirect, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { KeyProvider, useKey } from './components/KeyContext';

import { APIKey } from './pages/Forms';
import { Gallery } from './pages/Views';

import * as Type from './types/pantheon';
import * as Const from './constants';
import api from './api';

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

  const loadBase = async ({request}: RRDLoaderProps) => {
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

  const loadGallery = async ({request}: RRDLoaderProps) => (
    api.poke<any>({
      app: "pantheon-agent",
      mark: "pantheon-action",
      json: {"sync-files": {"merge": "theirs"}},
    }).then((result: number) =>
      new Promise(resolve => {
        setTimeout(resolve, 2000);
        return result;
      })
    ).then((result: any) =>
      api.scry<Type.ScryFile[]>({app: 'pantheon-agent', path: '/files'})
    )
  );

  return (
    <RouterProvider router={createBrowserRouter([
      {
        path: Const.APP_PATH,
        loader: loadBase,
        children: [
          {
            path: Const.KEY_PATH.split("/").slice(-1)[0],
            element: <APIKey />,
          },
          {
            path: Const.GALLERY_PATH.split("/").slice(-1)[0],
            element: <Gallery />,
            loader: loadGallery,
          },
        ],
      },
    ])} />
  );
};
