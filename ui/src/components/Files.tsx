import React, { useState, useEffect } from 'react';

import { formatFileExt, getSlateSource } from '../utils';
import * as Type from '../types/pantheon';

interface FilePreviewProps {
  file?: File;
}

interface FileViewProps {
  file: Type.ScryFile;
  type: "thumbnail" | "preview" | "fullscreen";
  className?: string;
}

// Source: https://blog.logrocket.com/using-filereader-api-preview-images-react
export const FilePreview = ({file}: FilePreviewProps) => {
    const [previewURL, setPreviewURL] = useState<string | undefined>(undefined);

    useEffect(() => {
      let fileReader: FileReader | undefined = undefined;
      let isCancel: boolean = false;
      if(file) {
        fileReader = new FileReader();
        fileReader.onload = (e: ProgressEvent) => {
          const {result} = (e.target as FileReader);
          if(result && !isCancel) {
            setPreviewURL((result as string));
          }
        }
        fileReader.readAsDataURL(file);
      }
      return () => {
        isCancel = true;
        if(fileReader && fileReader.readyState === 1) {
          fileReader.abort();
        }
      }
    }, [file]);

    return !(file && !file.type.startsWith("image")) ? (
      <img className="image-preview" src={previewURL} />
    ) : (
      <div className="flex justify-center image-preview">
        <div className="flex items-end">
          <h1>.{formatFileExt(file)}</h1>
        </div>
      </div>
    );
};

export const FileView = ({file, type, className}: FileViewProps) => {
  // TODO: Fix this hack by including the file MIME type provided by
  // the Slate API (as object['type'], which corresponds to 'file.type').
  // TODO: Fix the hacks in here where the manually-calculated size of
  // the navbar is used to adjust the calculated height (i.e. 53px).
  const isFileImage: boolean = (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(file.name);

  switch(type) {
    case "fullscreen":
      return isFileImage ? (
        <div className="flex h-[calc(100vh-53px)]">
          <img className="object-scale-down object-center mx-auto" src={getSlateSource(file)} />
        </div>
      ) : (
        <div className="flex justify-center h-[calc(100vh-53px)]">
          <div className="flex items-center">
            <h1>No File Preview Available!</h1>
          </div>
        </div>
      );
    case "preview":
      return isFileImage ? (
        <img className="image-preview" src={getSlateSource(file)} />
      ) : (
        <div className="flex justify-center image-preview">
          <div className="flex items-end">
            <h1>.{formatFileExt(file)}</h1>
          </div>
        </div>
      );
    default: // case "thumbnail":
      return isFileImage ? (
        <img className="object-cover object-center h-64 w-11/12 mx-auto border border-bgs1"
           src={getSlateSource(file)} />
      ) : (
        <div className="flex justify-center h-64 w-11/12 mx-auto border border-bgs1">
          <div className="flex items-end">
            <h1>.{formatFileExt(file)}</h1>
          </div>
        </div>
      );
  }
};
