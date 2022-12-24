import React, { useState } from 'react';
import { useSearchParams, useLoaderData } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import * as Type from '../types/pantheon';
import api from '../api';

export const Gallery = () => {
  const files = useLoaderData() as Type.ScryFile[];
  const [query, setQuery] = useState<string>("");
  // const [query, setQuery] = useSearchParams<string>("");

  // TODO: Add panes for each file entry
  // TODO: Add a fake first pane to add new entries
  // TODO: Add a modal/q?= form to edit the content of each entry
  // TODO: Add support for rendering previews of gif, pdf, md

  return (
    <React.Fragment>
      <NavBar query={query} setQuery={setQuery} />
      <h1 className="text-3xl">File List</h1>
      {Object.values(files).map(file => (
        <React.Fragment key={file.cid}>
          <h2 className="text-xl">{file.name}</h2>
          {/*TODO: This doesn't always work because it will only preview native
          content. Links will need to be handled separately (just take from link
          metadata provided by Slate).*/}
          <img src={`https://slate.textile.io/ipfs/${file.cid}`} />
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};
