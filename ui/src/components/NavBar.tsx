import React, { ChangeEvent, KeyboardEvent, useState, useCallback, useRef } from 'react';
import { redirect, Link } from 'react-router-dom';
import type { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  HomeIcon, DocumentPlusIcon, UserIcon,
  ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon,
  PhotoIcon, InformationCircleIcon, PencilSquareIcon,
  Cog6ToothIcon, MagnifyingGlassIcon, XMarkIcon
} from '@heroicons/react/24/solid';

import api from '../api';
import { useKey } from '../components/KeyContext';

import { encodeQueryParams, decodeQueryParams } from '../utils';
import * as Type from '../types/pantheon';
import * as Const from '../constants';

interface NavBarProps {
  params: ReturnType<typeof useSearchParams>[0];
  setParams: ReturnType<typeof useSearchParams>[1];
  mode: Type.GalleryMode;
  setMode: (mode: Type.GalleryMode) => void;
}

// TODO: Change this to 'file' and 'position' parameters (where
// position contains index and cids of files... maybe just 3 adjacent files?).
interface FocusNavBarProps extends NavBarProps {
  index: number;
  total: number;
  files: (Type.ScryFile | undefined)[];
}

export const SplashNavBar = ({params, setParams, mode, setMode}: NavBarProps) => {
  const prevQueryParams: Type.QueryParams = decodeQueryParams(params.get("q") || "///");

  const [queryName, setQueryName] = useState<string>(prevQueryParams[0]);
  const [queryExtension, setQueryExtension] = useState<string>(prevQueryParams[1]);
  const [queryPrivacy, setQueryPrivacy] = useState<Type.PrivacyFilter>((prevQueryParams[2] as Type.PrivacyFilter));
  const [queryAuthor, setQueryAuthor] = useState<string>(prevQueryParams[3]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const onChange = (queryParam: string, setQueryParam: (s: string) => void) => (
    useCallback((event: ChangeEvent<HTMLInputElement>) => {
      const {value}: {value: string;} = event.target;
      setQueryParam(value.replace(/\//g, ""));
    }, [queryParam, setQueryParam])
  );
  const onChangeName = onChange(queryName, setQueryName);
  const onChangeExtension = onChange(queryExtension, setQueryExtension);
  const onChangePrivacy = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const {value}: {value: string;} = event.target;
    setQueryPrivacy((value as Type.PrivacyFilter));
  }, [queryPrivacy, setQueryPrivacy]);
  const onChangeAuthor = onChange(queryAuthor, setQueryAuthor);

  const submitQuery = useCallback(() => {
    const queryParams: Type.QueryParams =
      [queryName, queryExtension, queryPrivacy, queryAuthor];
    if(queryParams.find(param => param !== "")) {
      params.delete("i");
      params.set("q", encodeQueryParams(queryParams));
      setIsExpanded(false);
      setParams(params.toString());
    }
  }, [queryName, queryExtension, queryPrivacy, queryAuthor, params, setParams, setIsExpanded]);
  const submitFile = useCallback(() => {
    params.set("i", "");
    setParams(params.toString());
  }, [params, setParams]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter") {
      event.preventDefault();
      submitQuery();
    }
  }, [submitQuery]);
  const onSubmit = useCallback(() => {
    submitQuery();
  }, [submitQuery]);
  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded, setIsExpanded]);
  const autofillAuthor = useCallback(() => {
    setQueryAuthor(`~${api.ship}`);
  }, [queryAuthor, setQueryAuthor]);

  /* TODO: Add configuration screen for the official release.
        <button>
          <Link to={Const.CONFIG_PATH}>
            <Cog6ToothIcon />
          </Link>
        </button>
  */

  return (
    <nav className="bg-bgp1 border-bgs1">
      <div className="flex flex-row gap-2">
        <button>
          <Link to={Const.GALLERY_PATH}>
            <HomeIcon />
          </Link>
        </button>
        <button onClick={submitFile}>
          <DocumentPlusIcon />
        </button>
        <div className="grid gap-2 grid-cols-1 overflow-y-auto flex-1 min-w-0">
          <div className="flex-1 min-w-0 input-group">
            <div className="flex flex-1 min-w-0 relative items-center input-group">
              <input type="text" placeholder="Search name..."
                value={queryName} onChange={onChangeName} onKeyDown={onKeyDown} />
              {isExpanded ?
                (<ChevronUpIcon className="icon-control" onClick={toggleExpand} />) :
                (<ChevronDownIcon className="icon-control" onClick={toggleExpand} />)
              }
            </div>
            <button onClick={onSubmit} >
              <MagnifyingGlassIcon />
            </button>
          </div>
          {isExpanded && (
            <React.Fragment>
              <input type="text" placeholder="Search extension..."
                value={queryExtension} onChange={onChangeExtension} onKeyDown={onKeyDown} />
              <select onChange={onChangePrivacy} defaultValue={queryPrivacy}>
                <option value="">No Privacy Filter</option>
                <option value="private">Private</option>
                <option value="protected">Protected (Pals)</option>
                <option value="public">Public</option>
              </select>
              <div className="flex flex-1 min-w-0 relative items-center">
                <input type="text" placeholder="Search author..."
                  value={queryAuthor} onChange={onChangeAuthor} onKeyDown={onKeyDown} />
                <UserIcon className="icon-control" onClick={autofillAuthor} />
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  );
};

export const UploadNavBar = ({params, setParams, mode, setMode}: NavBarProps) => {
  const onClose = useCallback(() => {
    params.delete("i");
    setParams(params.toString());
  }, [params, setParams]);

  return (
    <nav className="bg-bgp2 border-bgs1">
      <div className="flex flex-row justify-between">
        {/* Left Nav */}
        <div />
        {/* Center Nav */}
        <div className="flex flex-row items-center">
          <h2>{"Upload File"}</h2>
        </div>
        {/* Right Nav */}
        <div className="flex flex-row gap-2 items-center">
          <button onClick={onClose}>
            <XMarkIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};

export const FocusNavBar =
    ({params, setParams, mode, setMode, index, total, files}: FocusNavBarProps) => {
  const onNext = useCallback(() => {
    if(files[2] !== undefined) {
      params.set("i", files[2].cid);
      setParams(params.toString());
    }
  }, [params, setParams]);
  const onPrev = useCallback(() => {
    if(files[0] !== undefined) {
      params.set("i", files[0].cid);
      setParams(params.toString());
    }
  }, [params, setParams]);

  const onClose = useCallback(() => {
    params.delete("i");
    setParams(params.toString());
  }, [params, setParams]);
  const onToggle = useCallback(() => {
    setMode((mode === "simple") ? "detail" : "simple");
  }, [mode, setMode]);

  // TODO: Make this navbar match the height of the main navbar.
  // TODO: Improve the behavior of this navbar when in mobile mode.

  return (
    <nav className="bg-bgp2 border-bgs1">
      <div className="flex flex-row justify-between">
        {/* Left Nav */}
        <div className="flex flex-row gap-2 items-center">
          <button onClick={onPrev} disabled={files[0] === undefined}>
            <ChevronLeftIcon />
          </button>
          <h2>{index + 1} / {total}</h2>
          <button onClick={onNext} disabled={files[2] === undefined}>
            <ChevronRightIcon />
          </button>
        </div>
        {/* Center Nav */}
        <div className="flex flex-row items-center hidden sm:block">
          <h2>{files[1]?.name}</h2>
        </div>
        {/* Right Nav */}
        <div className="flex flex-row gap-2 items-center">
          <button onClick={onToggle}>
            {(mode === "simple") ?
              (<InformationCircleIcon />) :
              (<PhotoIcon />)
            }
          </button>
          <button onClick={onClose}>
            <XMarkIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};
