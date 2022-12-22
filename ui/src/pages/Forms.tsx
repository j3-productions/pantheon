import React from 'react';
import { useForm } from 'react-hook-form';
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { useKey } from '../components/KeyContext';
import * as Type from '../types/pantheon';
import * as Const from '../constants';
import api from '../api';

export const APIKey = () => {
  const [key, resetKey] = useKey();

  const {register, handleSubmit, formState: {errors}} = useForm<Type.PokeKey>();
  const onSubmit = ({key}: Type.PokeKey) => {
    api.poke<any>({
      app: "pantheon-agent",
      mark: "pantheon-action",
      json: {"add-key": {"key": key as string}},
    }).then((result: number) =>
      resetKey()
    );
  };

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
            {...register("key", {required: true, pattern: Const.KEY_REGEX})}
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
