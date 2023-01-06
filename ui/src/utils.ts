import * as Type from "./types/pantheon";
import * as Const from "./constants";

/////////////////////////
/// General Functions ///
/////////////////////////

export function enumerateObject<ValueType>(
    object: Record<string, ValueType>) :
    [Record<number, string>, Record<string, number>] {
  return Object.entries<ValueType>(object).reduce((
      [ai2k, ak2i]: [Record<number, string>, Record<string, number>],
      [nkey, nval]: [string, ValueType],
      nind: number) => {
    ai2k[nind] = nkey;
    ak2i[nkey] = nind;
    return [ai2k, ak2i];
  }, ([{}, {}] as [Record<number, string>, Record<string, number>]));
}

// https://stackoverflow.com/a/37164538/837221
export function mergeDeep(
    target: {[index: string]: any},
    source: {[index: string]: any}):
      {[index: string]: any} {
  const isObject = (item: any): item is {[index: string]: any} => {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, {[key]: source[key]});
      }
    });
  }

  return output;
}

//////////////////////////////
/// App-Specific Functions ///
//////////////////////////////

export function formatFileExt(file: File | Type.ScryFile): string {
  if(file instanceof File) {
    const formatMatches = file.type.match(/([^\/]+\/)?([^\/]+)/);
    return (formatMatches ? formatMatches[2] : file.type).toUpperCase();
  } else {
    const fileExtRaw: RegExpExecArray | null = /[^.]+$/.exec(file.name);
    return (fileExtRaw !== null) ? (fileExtRaw[0] as string).toUpperCase() :
      "(No Extension)";
  }
}

export const encodeQueryParams = (queryParams: Type.QueryParams): string => {
  return encodeURIComponent(queryParams.join("/"))
};

export const decodeQueryParams = (queryString: string): Type.QueryParams => {
  return (decodeURIComponent(queryString).split("/") as Type.QueryParams);
};

//////////////////////////////
/// External API Functions ///
//////////////////////////////

export const getSlateSource = (file: Type.ScryFile): string => (
  `https://slate.textile.io/ipfs/${file.cid}`
);

export const getSlateData = (key: string): object => (
  fetch(Const.API_BASE_PATH + "get", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": key,
    }
  }).then((result: Response) =>
    result.json()
  )
);

export const getSlateCollection = (key: string, id: string): object => (
  fetch(Const.API_BASE_PATH + "get-collection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": key,
    },
    body: JSON.stringify({data: {id}}),
  }).then((result: Response) =>
    result.json()
  ).then((result: any) =>
    result.collection
  )
);

export const getSlateTagID = (key: string, tag: string) => (
  fetch(Const.API_BASE_PATH + "create-collection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": key,
    },
    body: JSON.stringify({data: {
      name: tag,
      isPublic: true,
      body: "",
    }}),
  }).then((result: Response) =>
    getSlateData(key)
  ).then(({collections}: any) =>
    collections.find((collection: any) =>
      collection.slatename === tag
    )?.id
  )
);

export const uploadSlateFile = (key: string, file: File/*, name: string, tags: string[]*/) => {
  // TODO: Indicate that 'name' should be used for the file in Slate.
  let uploadData = new FormData();
  uploadData.append("data", file);

  return getSlateTagID(key, Const.APP_TAG_NAME).then((appTagId: string) =>
    fetch(Const.API_UPLOAD_PATH + appTagId, {
      method: "POST",
      headers: {"Authorization": key},
      body: uploadData,
    })
  );
  // TODO: The following attempt at tag support has been omitted because
  // the Slate API throws 500 errors when attempting to add new objects
  // to a collection; only trivial metadata can be changed (e.g. title,
  // description). Attempting to modify the object to add the right tags
  // has similar results.
  /*
  .then((fileObject: object) =>
    Promise.all(tags.map((tag: string) =>
      getSlateTagID(key, tag).then((tagId: string) =>
        getSlateCollection(key, tagId)
      ).then((collection: object) => {
        console.log(fileObject);
        console.log(collection);
        collection.objects.push(fileObject);
        console.log(collection);
        return fetch(Const.API_BASE_PATH + "update-collection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": key,
          },
          body: JSON.stringify({data: collection})
        });
      })
    ))
  );
  */
};
