import React, { ChangeEvent, KeyboardEvent, useState, useCallback } from 'react';
import { redirect, Link } from 'react-router-dom';
import type { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  HomeIcon, DocumentPlusIcon,
  Cog6ToothIcon, MagnifyingGlassIcon
} from '@heroicons/react/24/solid';
import { useKey } from '../components/KeyContext';
import * as Type from '../types/pantheon';
import * as Const from '../constants';
import api from '../api';

interface NavBarProps {
  params: ReturnType<typeof useSearchParams>[0];
  setParams: ReturnType<typeof useSearchParams>[1];
}

export const NavBar = ({params, setParams}: NavBarProps) => {
  const [query, setQuery] = useState<string>(params.get("q") || "");
  const submitQuery = useCallback(() => {
    if(query !== "") {
      params.set("q", query);
      setParams(params.toString());
    }
  }, [query, params, setParams]);

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const {value}: {value: string;} = event.target;
    setQuery(value);
  }, [query, setQuery]);
  const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter") {
      event.preventDefault();
      submitQuery();
    }
  }, [submitQuery]);
  const onClick = useCallback(() => {
    submitQuery();
  }, [submitQuery]);

  return (
    <nav>
      <div className="flex flex-row gap-2">
        <button>
          <Link to={Const.GALLERY_PATH}>
            <HomeIcon />
          </Link>
        </button>
        <button>
          <Link to={`?q=`}>
            <DocumentPlusIcon />
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
