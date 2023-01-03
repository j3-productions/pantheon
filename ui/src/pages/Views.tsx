import React, { useState, useCallback } from 'react';
import { useSearchParams, useLoaderData } from 'react-router-dom';

import api from '../api';
import { useKey } from '../components/KeyContext';
import { SplashNavBar, FocusNavBar } from '../components/NavBar';

import * as Type from '../types/pantheon';
import * as Const from '../constants';
import { enumerateObject } from '../utils';

interface GalleryViewProps {
  files: Type.ScryFiles;
}

export const Gallery = () => {
  const files = useLoaderData() as Type.ScryFiles;
  const [key, resetKey] = useKey();
  const [params, setParams] = useSearchParams();

  const [find2fcid, fcid2find] = enumerateObject<Type.ScryFile>(files);
  const focusIndex = params.get("i") && fcid2find[params.get("i") || ""];
  const isFocused = Number.isInteger(focusIndex);

  // TODO: Add support for rendering the content retrieved from a '?q=' query.
  // TODO: Add support for rendering previews of gif, pdf, md
  // TODO: Perfect the scaling ratios as the screen gets wider.
  // TODO: Improve margins and centering so that margins between items
  // match margins between items and the edge of the screen.

  const getSource = (file: Type.ScryFile) => (
    `https://slate.textile.io/ipfs/${file.cid}`
  );

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
        fileSource = getSource(file);
        fileDesc = (
          <React.Fragment>
            <h2>{file.name}</h2>
            <p>{fileExt}</p>
          </React.Fragment>
        );
    }

    const focusFile = useCallback(() => {
      params.set("i", file.cid);
      setParams(params.toString());
    }, [params, setParams]);

    return (
      <div className="hover:cursor-pointer" onClick={focusFile}>
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
  const GallerySplash = ({files}: GalleryViewProps) => (
    <div className={`py-4 grid gap-4
        grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        overflow-y-auto`}>
      {Object.values(files).map(file => (
        <GalleryEntry key={file.cid} {...file} />
      ))}
    </div>
  );
  // TODO: (i="*") Create a variant of the above form that intakes a file and fields
  // and then submits this info directly to Slate (using provided API key).
  const GalleryFocus = ({files}: GalleryViewProps) => {
    const file: Type.ScryFile = files[params.get("i") || ""];
    const mode: Type.GalleryMode = (params.get("m") || "simple") as Type.GalleryMode;

    return (mode === "simple") ?
        (<img className="object-cover object-center" src={getSource(file)} />) :
      (mode === "detail") ?
        (<p>TODO: Detail Mode</p>) :
      (<p>TODO: Modify Mode</p>);
  };

  return isFocused ? (
    <React.Fragment>
      <FocusNavBar params={params} setParams={setParams}
        index={focusIndex as number} total={Object.keys(files).length}
        files={[-1, 0, 1]
          .map((offset: number) => find2fcid[(focusIndex as number) + offset])
          .map((cid: string | undefined) => cid ? files[cid] : undefined)
        } />
      <GalleryFocus files={files} />
    </React.Fragment>
  ) : (
    <React.Fragment>
      <SplashNavBar params={params} setParams={setParams} />
      <GallerySplash files={files} />
    </React.Fragment>
  );
};
