import React, { useState, useContext } from 'react';
import {
  json, redirect, useLoaderData,
  createBrowserRouter, RouterProvider,
} from 'react-router-dom';
import api from './api';

export function App() {
  const [apiData, setApiData] = useState({key: "", isSet: false});

  const KeyForm = () => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const key: string = formData.get("key");

      api.poke<any>({
        app: "pantheon-agent",
        mark: "pantheon-action",
        json: {"add-key": {"key": key}},
      }).then(
        setApiData({key: "", isSet: false})
      );
    };

    return (
      <React.Fragment>
        <h1 className="text-3xl">Please enter your Slate API key:</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <input className="border border-black border-solid" name="key" type="text" />
          </label>
          <button type="submit">Submit</button>
        </form>
      </React.Fragment>
    );
  };

  const ApiForm = () => {
    // {cid: {cid: '', name: '', tags: [{name: '', id: '', slatename: ''}]}, ...}
    const files: object = useLoaderData();
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

  const router = createBrowserRouter([
    { // redirect if API key isn't set; fetch API key first
      path: "/apps/pantheon/",
      loader: async ({request}) => {
        const url: string = (new URL(request.url)).pathname;
        if(!apiData.isSet) {
          const urbKey: string = await api.scry<object>(
            {app: 'pantheon-agent', path: '/key'}).then(
            ({key}) => key);
          return setApiData({key: urbKey, isSet: true});
        } else if(apiData.key === "" && !url.match(/\/apps\/pantheon\/key.*/)) {
          return redirect("/apps/pantheon/key");
        } else if(apiData.key !== "" && !url.match(/\/apps\/pantheon\/api.*/)) {
          return redirect("/apps/pantheon/api");
        } else {
          return 0;
        }
      },
      children: [
        {
          path: "key",
          element: <KeyForm />,
        },
        {
          path: "api",
          element: <ApiForm />,
          loader: async () => (
            api.poke<any>({
              app: "pantheon-agent",
              mark: "pantheon-action",
              json: {"sync-files": {"merge": "theirs"}},
            }).then((result: number) =>
              new Promise(resolve => {
                setTimeout(resolve, 2000);
                return result;
              })
            ).then((result: number) => (
              api.scry<object[]>({app: 'pantheon-agent', path: '/files'})
            ))
          ),
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}
