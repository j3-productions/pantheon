import React, { ChangeEvent, KeyboardEvent, useCallback } from 'react';
import { redirect, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HomeIcon, PlusIcon, Cog6ToothIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useKey } from '../components/KeyContext';
import * as Type from '../types/pantheon';
import * as Const from '../constants';
import api from '../api';

interface NavBarProps {
  query: string;
  setQuery: (value: string) => void;
}

export const NavBar = ({query, setQuery}: NavBarProps) => {
  // TODO: Enable search bar going to a '?q=' page

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const {value}: {value: string;} = event.target;
    setQuery(value);
  }, [query, setQuery]);
  const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter" && query !== "") {
      event.preventDefault();
      console.log(query);
      // navigate(`/search/${searchPlanet}/${searchBoard}/${query}`);
    }
  }, [query]);
  const onClick = useCallback(() => {
    if(query !== "") {
      console.log(query);
      // navigate(`/search/${searchPlanet}/${searchBoard}/${query}`);
    }
  }, [query]);

  return (
    <nav>
      <div className="flex flex-row gap-2">
        <button>
          <Link to={Const.GALLERY_PATH}>
            <HomeIcon />
          </Link>
        </button>
        <div className="flex-1 min-w-0 input-group">
          <input type="text" placeholder="Search..."
              value={query} onChange={onChange} onKeyDown={onKeyDown} />
          <button onClick={onClick} >
            <MagnifyingGlassIcon />
          </button>
        </div>
        <button>
          <Link to={Const.CONFIG_PATH}>
            <Cog6ToothIcon />
          </Link>
        </button>
      </div>
    </nav>
  );
};
