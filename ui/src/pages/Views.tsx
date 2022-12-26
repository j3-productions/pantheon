import React, { useState } from 'react';
import { useSearchParams, useLoaderData } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import * as Type from '../types/pantheon';
import api from '../api';

export const Gallery = () => {
  const files = useLoaderData() as Type.ScryFile[];
  const [query, setQuery] = useState<string>("");
  // const [query, setQuery] = useSearchParams<string>("");

  // TODO: Links will need to be handled separately (just take from link
  // metadata provided by Slate).
  // TODO: Add a fake first pane to add new entries
  // TODO: Add a modal/q?= form to edit the content of each entry
  // TODO: Add support for rendering previews of gif, pdf, md
  // TODO: Perfect the scaling ratios as the screen gets wider.
  // TODO: Improve margins and centering so that margins between items
  // match margins between items and the edge of the screen.

  const GalleryEntry = ({file}: {file: Type.ScryFile}) => {
    const fileExtRaw: RegExpExecArray | null = /[^.]+$/.exec(file.name);
    const fileExt: string = (fileExtRaw !== null) ?
      (fileExtRaw[0] as string).toUpperCase() : "(No Extension)";

    return (
      <div>
        <img className="object-cover object-center h-64 w-11/12 mx-auto border border-bgs1"
          src={`https://slate.textile.io/ipfs/${file.cid}`} />
        <div className="border-x border-b border-bgs1 w-11/12 mx-auto px-2">
          <h2>{file.name}</h2>
          <p>{fileExt}</p>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <NavBar query={query} setQuery={setQuery} />
      <div className="grid py-4 gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto">
        {/*TODO: Fake entry with plus sign that enables new entries.*/}
        {Object.values(files).map(file => (
          <GalleryEntry key={file.cid} file={file} />
        ))}
      </div>
    </React.Fragment>
  );
};
