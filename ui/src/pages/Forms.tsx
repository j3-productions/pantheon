import React from 'react';
import { useForm } from 'react-hook-form';
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { useKey } from '../components/KeyContext';
import * as Type from '../types/pantheon';
import * as Const from '../constants';
import api from '../api';

export const KeyEntry = () => {
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
          <div className="input-group w-11/12">
            <input type="text" autoComplete="off"
              placeholder="API Key, e.g.: SLAabcdef12-1234-abcd-1234-abcdef123456TE"
              {...register("key", {required: true, pattern: Const.KEY_REGEX})} />
            <button type="submit">
              <PlusIcon />
            </button>
          </div>
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

export const AppConfig = () => {
  // TODO: Allow the user to change: mode (dark/light), API key, etc..

  return (
    <p>TODO</p>
  );
};
