import React, { useState } from 'react';
import { useSearchParams, useLoaderData } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import * as Type from '../types/pantheon';
import * as Const from '../constants';
import api from '../api';

export const Gallery = () => {
  const files = useLoaderData() as Type.ScryFile[];
  const [params, setParams] = useSearchParams();

  // TODO: Add a modal/q?= form to edit the content of each entry
  //   - ?i=...: Open up an overlay for an existing item (or new if ?i="")
  //   - ?q=...: Present the content acquired after searching for ?q="..."
  // TODO: Add support for rendering previews of gif, pdf, md
  // TODO: Perfect the scaling ratios as the screen gets wider.
  // TODO: Improve margins and centering so that margins between items
  // match margins between items and the edge of the screen.

  const GalleryEntry = (file: Type.ScryFile) => {
    const fileExtRaw: RegExpExecArray | null = /[^.]+$/.exec(file.name);
    const fileExt: string = (fileExtRaw !== null) ?
      (fileExtRaw[0] as string).toUpperCase() : "(No Extension)";

    let fileSource: string = "";
    let fileDesc: React.ReactNode | null = null;
    // TODO: Implement this once the format for link data has been finalized.
    switch("file") {
      // case "link":
      //   fileSource = Const.ASSET_PATH + "plus-sign.svg";
      //   fileDesc = null;
      //   break;
      default: // case "file":
        fileSource = `https://slate.textile.io/ipfs/${file.cid}`;
        fileDesc = (
          <React.Fragment>
            <h2>{file.name}</h2>
            <p>{fileExt}</p>
          </React.Fragment>
        );
        break;
    }

    return (
      <div>
        <img className="object-cover object-center h-64 w-11/12 mx-auto border border-bgs1"
          src={fileSource} />
        {fileDesc && (
          <div className="border-x border-b border-bgs1 w-11/12 mx-auto px-2">
            {fileDesc}
          </div>
        )}
      </div>
    );
  };

  return (
    <React.Fragment>
      <NavBar params={params} setParams={setParams} />
      <div className="grid py-4 gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto">
        {Object.values(files).map(file => (
          <GalleryEntry key={file.cid} {...file} />
        ))}
      </div>
    </React.Fragment>
  );
};
