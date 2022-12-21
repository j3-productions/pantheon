import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { redirect, useLoaderData, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import * as Type from './types/pantheon';
import api from './api';

export function App() {
  const [apiData, setApiData] = useState({key: "", isSet: false});

  const KeyForm = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<Type.PokeKey>();
    const onSubmit = ({key}: Type.PokeKey) => {
      api.poke<any>({
        app: "pantheon-agent",
        mark: "pantheon-action",
        json: {"add-key": {"key": key as string}},
      }).then((result: number) =>
        setApiData({key: "", isSet: false})
      );
    };

    const keyRegex: RegExp = /^SLA([a-f0-9]{8})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{12})TE$/;

    return (
      <React.Fragment>
        <div className="grid gap-y-8 py-16 text-center">
          <h1>Welcome to <code>%pantheon</code>!</h1>
          <h1>First, Sign Up for <a href="https://slate.host/_/auth?tab=signup">Slate</a>.</h1>
          <h1>Then, Add Your <a href="https://slate.host/_/api">API Key</a>:</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row justify-center">
            <input type="text" autoComplete="off"
              placeholder="API Key, e.g.: SLAabcdef12-1234-abcd-1234-abcdef123456TE"
              {...register("key", {required: true, pattern: keyRegex})}
              className={`w-9/12 py-2 px-3 bg-bgp1
                border border-bgp2 rounded-l-lg
                ring-bgs2 ring-inset focus:outline-none focus:ring-2`} />
            <button type="submit" className={`rounded-r-lg py-2 px-3
                font-semibold border-2 transition-colors
                text-bgp1 bg-bgs1 border-bgs2/0 hover:border-bgs2/60`}>
              <PlusIcon className="h-6 w-6 text-fgp1" />
            </button>
          </div>
          <div className="flex flex-row justify-center">
            {errors.key &&
              <React.Fragment>
                <ExclamationTriangleIcon className="h-6 w-6 text-fgs1" />
                {(errors.key.type === "required") ?
                  (<p>Please enter your API key.</p>) :
                  (<p>Given API key is malformatted.</p>)}
              </React.Fragment>
            }
          </div>
        </form>
      </React.Fragment>
    );
  };

  const ApiForm = () => {
    // {cid: {cid: '', name: '', tags: [{name: '', id: '', slatename: ''}]}, ...}
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

  const router = createBrowserRouter([
    { // redirect if API key isn't set; fetch API key first
      path: "/apps/pantheon/",
      loader: async ({request}) => {
        const url: string = (new URL(request.url)).pathname;
        if(!apiData.isSet) {
          const urbKey: string = await api.scry<Type.ScryKey>(
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
            ).then((result: any) =>
              api.scry<Type.ScryFile[]>({app: 'pantheon-agent', path: '/files'})
            )
          ),
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}
