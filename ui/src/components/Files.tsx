import React, { useState, useEffect } from 'react';

interface FilePreviewProps {
  file?: File;
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

    return (
      <img className="image-preview" src={previewURL} />
    );
};
