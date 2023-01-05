import React, { ChangeEvent, useState, useCallback } from 'react';
import { Link, useSearchParams, useLoaderData } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MultiValue } from 'react-select';
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'

import api from '../api';
import { useKey } from '../components/KeyContext';
import { TagField } from '../components/Fields';
import { FilePreview } from '../components/Files';
import { SplashNavBar, UploadNavBar, FocusNavBar } from '../components/NavBar';

import * as Type from '../types/pantheon';
import * as Const from '../constants';
import { enumerateObject, formatFileExt, uploadSlateFile } from '../utils';

interface GalleryViewProps {
  files: Type.ScryFiles;
}

export const Gallery = () => {
  const files = useLoaderData() as Type.ScryFiles;
  const [mode, setMode] = useState<Type.GalleryMode>("simple");
  const [key, resetKey] = useKey();
  const [params, setParams] = useSearchParams();
  const navParams = {params, setParams, mode, setMode};

  const [find2fcid, fcid2find] = enumerateObject<Type.ScryFile>(files);
  const focusIndex = params.get("i") ? fcid2find[params.get("i") || ""] : undefined;

  // TODO: Shared component for rendering 'Type.ScryFile'.

  // TODO: Add support for rendering the content retrieved from a '?q=' query.
  // TODO: Add support for rendering previews of gif, pdf, md
  // TODO: Perfect the scaling ratios as the screen gets wider.
  // TODO: Improve margins and centering so that margins between items
  // match margins between items and the edge of the screen.

  const getSource = (file: Type.ScryFile) => (
    `https://slate.textile.io/ipfs/${file.cid}`
  );

  const GalleryEntry = (file: Type.ScryFile) => {
    const fileExtRaw: RegExpExecArray | null = /[^.]+$/.exec(file.name);
    const fileExt: string = (fileExtRaw !== null) ?
      (fileExtRaw[0] as string).toUpperCase() : "(No Extension)";

    let fileSource: string = "";
    let fileDesc: React.ReactNode | null = null;
    // TODO: Implement this once the format for link data has been finalized.
    switch("file") {
      // case "link":
      //   fileSource = Const.ASSET_PATH + "plus-sign.svg";
      //   fileDesc = null;
      //   break;
      default: // case "file":
        fileSource = getSource(file);
        fileDesc = (
          <React.Fragment>
            <h2>{file.name}</h2>
            <p>{fileExt}</p>
          </React.Fragment>
        );
    }

    const focusFile = useCallback(() => {
      params.set("i", file.cid);
      setParams(params.toString());
    }, [params, setParams]);

    return (
      <div className="hover:cursor-pointer" onClick={focusFile}>
        <img className="object-cover object-center h-64 w-11/12 mx-auto border border-bgs1"
          src={fileSource} />
        {fileDesc && (
          <div className="border-x border-b border-bgs1 w-11/12 mx-auto px-2">
            {fileDesc}
          </div>
        )}
      </div>
    );
  };
  const GallerySplash = ({files}: GalleryViewProps) => (
    <div className={`py-4 grid gap-4
        grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        overflow-y-auto`}>
      {Object.values(files).map(file => (
        <GalleryEntry key={file.cid} {...file} />
      ))}
    </div>
  );
  const GalleryFocus = ({files}: GalleryViewProps) => {
    const file: Type.ScryFile = (files[params.get("i") || ""]) as Type.ScryFile;

    // TODO: Create the view of the file with all relevant metadata, with a
    // button at the bottom for editing (if the file belongs to the user).
    // TODO: Create the form for the file similar to the view but it allows
    // for editing fields and submitting changes.

    if(mode === "simple") {
      return (
        <img className="object-cover object-center" src={getSource(file)} />
      );
    } else { // if(mode === "detail")
      return (
        <p>TODO: Detail Mode</p>
      );
    }
  };
  const GalleryUpload = ({files}: GalleryViewProps) => {
    const [file, setFile] = useState<File | undefined>(undefined);
    // const [name, setName] = useState<string>("");
    // const [tags, setTags] = useState<MultiValue<Type.FieldOption>>([]);
    const [privacy, setPrivacy] = useState<Type.PrivacySetting>("private");

    // TODO: Add separate support for links.
    // TODO: Populate form w/ suggestions based on existing files?
    // TODO: filename, tags, (privacy setting => must be set afterwards?)

    const {register, handleSubmit, formState: {errors}} = useForm();
    const onSubmit = (values: any) => {
      uploadSlateFile((key as string), values["upload"][0]).then((result: any) =>
        onClose()
      );
    };
    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      if(event.target && event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]);
      }
    };
    const onClose = useCallback(() => {
      params.delete("i");
      setParams(params.toString());
    }, [params, setParams]);

    return (
      <form className="py-4 px-4" onSubmit={handleSubmit(onSubmit)}>
        <div className={`grid gap-4
            grid-cols-1 sm:grid-cols-2
            overflow-y-auto`}>
          <div className="flex-none">
            <FilePreview file={file} />
            <label class="input-file mt-3">
              {/*TODO: Extend the accepted file types to plaintext and PDF: ,.pdf,.md,.txt.*/}
              <input type="file" accept="image/*"
                {...register("upload", {required: true, onChange: onFileChange})} />
              + Upload File
            </label>
          </div>
          <div className="flex-1">
            <div>
              <label htmlFor="name">File Name</label>
              <div className="flex items-center space-x-2">
                <input value={file ? file.name : "(No File Selected)"} disabled/>
              </div>
            </div>
            <div>
              <label htmlFor="ext">File Extension</label>
              <div className="flex items-center space-x-2">
                <input value={file ? formatFileExt(file) : "(No File Selected)"} disabled/>
              </div>
            </div>
            <div>
              <label htmlFor="privacy">Privacy Setting</label>
              <div className="flex items-center space-x-2">
                {/*TODO: Change this to be a select prompt of privacy settings.*/}
                <input placeholder="privacy setting"/>
              </div>
            </div>
            {/*<TagField tags={tags} onTags={setTags} />*/}
          </div>
          {/*
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
          */}
        </div>
        <div className='pt-3'>
          <div className='flex justify-between border-t border-bgs1 py-3'>
            <button onClick={onClose}>
              Dismiss
            </button>
            <button type="submit">
              Upload
            </button>
          </div>
        </div>
      </form>
    );
  };

  if(!params.has("i")) { // Gallery View
    return (
      <React.Fragment>
        <SplashNavBar {...navParams} />
        <GallerySplash files={files} />
      </React.Fragment>
    );
  } else if(!params.get("i")) {  // Upload View
    return (
      <React.Fragment>
        <UploadNavBar {...navParams} />
        <GalleryUpload files={files} />
      </React.Fragment>
    );
  } else { // Focus View
    return (
      <React.Fragment>
        <FocusNavBar {...navParams}
          index={focusIndex as number} total={Object.keys(files).length}
          files={[-1, 0, 1]
            .map((offset: number) => find2fcid[(focusIndex as number) + offset])
            .map((cid: string | undefined) => cid ? files[cid] : undefined)
          } />
        <GalleryFocus files={files} />
      </React.Fragment>
    );
  }
};
