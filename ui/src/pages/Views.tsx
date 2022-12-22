import React from 'react';
import { useLoaderData } from 'react-router-dom';
import * as Type from '../types/pantheon';
import api from '../api';

export const Gallery = () => {
  const files = useLoaderData() as Type.ScryFile[];

  return (
    <React.Fragment>
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
