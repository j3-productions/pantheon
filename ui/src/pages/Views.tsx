import React, { ChangeEvent, useState, useCallback } from 'react';
import { Link, useSearchParams, useLoaderData } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid'

import api from '../api';
import { useKey } from '../components/KeyContext';
import { TagField } from '../components/Fields';
import { FilePreview } from '../components/Files';
import { SplashNavBar, UploadNavBar, FocusNavBar } from '../components/NavBar';

import * as Type from '../types/pantheon';
import * as Const from '../constants';
import {
  enumerateObject, formatFileExt,
  getSlateSource, uploadSlateFile
} from '../utils';

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

  // NOTE: In order to force page reloads, this component sets 'u=1' and
  // then immediately erases it. The erasure will not cause a second reload.
  if(params.get("u") === "1") {
    params.delete("u");
    setParams(params.toString());
  }

  // TODO: Shared component for rendering 'Type.ScryFile'.
  // TODO: Add support for rendering the content retrieved from a '?q=' query.
  // TODO: Add support for rendering previews of gif, pdf, md
  // TODO: Perfect the scaling ratios as the screen gets wider.
  // TODO: Improve margins and centering so that margins between items
  // match margins between items and the edge of the screen.

  const GalleryEntry = (file: Type.ScryFile) => {
    let fileSource: string = "";
    let fileDesc: React.ReactNode | null = null;
    // TODO: Implement this once the format for link data has been finalized.
    switch("file") {
      // case "link":
      //   fileSource = Const.ASSET_PATH + "plus-sign.svg";
      //   fileDesc = null;
      //   break;
      default: // case "file":
        fileSource = getSlateSource(file);
        fileDesc = (
          <React.Fragment>
            <h2>{file.name}</h2>
            <p>{formatFileExt(file)}</p>
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
    const [isViewing, setIsViewing] = useState<boolean>(true);
    const [name, setName] = useState<string>(file.name);
    const [privacy, setPrivacy] = useState<Type.PrivacySetting>("private");

    const {register, setError, handleSubmit, formState: {errors}} = useForm();
    const onSubmit = (values: any) => {
      if(isViewing) {
        setIsViewing(!isViewing);
      } else {
        // TODO: During BE upgrade/integration, change this to submit an edit
        // poke to the Urbit back-end for this file object.
        console.log(name);
        console.log(privacy);
        setIsViewing(!isViewing);
        // TODO: Use the following to reload the page after an update:
        //
        // params.delete("i");
        // params.set("u", "1");
        // setParams(params.toString());
      }
    };
    const onNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      const {value}: {value: string;} = event.target;
      setName(value);
    }, [name, setName]);
    const onPrivacyChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const {value}: {value: string;} = event.target;
      setPrivacy((value as Type.PrivacySetting));
    };

    // TODO: During BE upgrade/integration, change this to be real author.
    const author: string = `~${api.ship}`;

    if(mode === "simple") {
      return (
        <img className="object-cover object-center" src={getSlateSource(file)} />
      );
    } else { // if(mode === "detail")
      return (
        <form className="py-4 px-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 overflow-y-auto">
            <div className="flex-none">
              <img className="image-preview" src={getSlateSource(file)} />
            </div>
            <div className="flex-1">
              <div>
                <label htmlFor="name">File Name</label>
                <div className="flex items-center space-x-2">
                  <input value={name} disabled={isViewing}
                    {...register("name", {required: !isViewing, pattern: Const.FILENAME_REGEX, onChange: onNameChange})} />
                </div>
              </div>
              <div className="flex flex-row justify-center">
                {errors.name &&
                  <React.Fragment>
                    <ExclamationTriangleIcon className="h-6 w-6 text-fgs1" />
                    {(errors.name.type === "required") ?
                      (<p>A filename is required.</p>) :
                      (<p>Filename must have a valid extension.</p>)}
                  </React.Fragment>
                }
              </div>
              <div>
                <label htmlFor="ext">File Extension</label>
                <div className="flex items-center space-x-2">
                  <input value={formatFileExt(file)} disabled/>
                </div>
              </div>
              <div>
                <label htmlFor="author">Urbit Author</label>
                <div className="flex items-center space-x-2">
                  <input value={author} disabled/>
                </div>
              </div>
              <div>
                <label htmlFor="privacy">Privacy Setting</label>
                <div className="flex items-center space-x-2">
                  <select onChange={onPrivacyChange} disabled={isViewing}>
                    <option value="private">Private</option>
                    <option value="protected">Protected (Pals)</option>
                  </select>
                </div>
              </div>
              {/*<TagField tags={tags} onTags={setTags} />*/}
            </div>
          </div>
          <div className='pt-3'>
            <div className='flex justify-between border-t border-bgs1 py-3'>
              <button>
                <a href={getSlateSource(file)} download>
                  Download
                </a>
              </button>
              <button type="submit" disabled={author !== `~${api.ship}`}>
                {isViewing ? "Edit" : "Submit"}
              </button>
            </div>
          </div>
        </form>
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
    // TODO: Add support for editing the filename and tags (collections).

    const {register, setError, handleSubmit, formState: {errors}} = useForm();
    const onSubmit = (values: any) => {
      // TODO: Attempt to account for malformatted files as well by testing
      // when 'file.type' cannot be derived.
      // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
      if(file === undefined) {
        setError("upload", {type: "required"});
      } else {
        // NOTE: In order to force page reloads, this component sets 'u=1' and
        // then immediately erases it. The erasure will not cause a second reload.
        // TODO: Add an intermediate step where we '%sync-file' and then update
        // the privacy setting of the file based on the user input (values["privacy"]).
        uploadSlateFile((key as string), values["upload"][0]).then((result: any) => {
          params.delete("i");
          params.set("u", "1");
          setParams(params.toString());
        });
      }
    };
    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      if(event.target && event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]);
      }
    };
    const onPrivacyChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const {value}: {value: string;} = event.target;
      setPrivacy((value as Type.PrivacySetting));
    };
    const onClose = useCallback(() => {
      params.delete("i");
      setParams(params.toString());
    }, [params, setParams]);

    return (
      <form className="py-4 px-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 overflow-y-auto">
          <div className="flex-none">
            <FilePreview file={file} />
            <label className="input-file mt-3">
              {/*TODO: Extend the accepted file types to plaintext and PDF: ,.pdf,.md,.txt.*/}
              <input type="file" accept="image/*"
                {...register("upload", {required: true, onChange: onFileChange})} />
              Choose File
            </label>
            <div className="flex flex-row justify-center">
              {errors.upload &&
                <React.Fragment>
                  <ExclamationTriangleIcon className="h-6 w-6 text-fgs1" />
                  {(errors.upload.type === "required") ?
                    (<p>Please select a file to continue.</p>) :
                    (<p>Given file is improperly formatted.</p>)}
                </React.Fragment>
              }
            </div>
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
                <select onChange={onPrivacyChange}>
                  <option value="private">Private</option>
                  <option value="protected">Protected (Pals)</option>
                </select>
              </div>
            </div>
            {/*<TagField tags={tags} onTags={setTags} />*/}
          </div>
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
