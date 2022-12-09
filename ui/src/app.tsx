import React, { useState, useContext } from 'react';
import {
  json, redirect, useLoaderData,
  createBrowserRouter, RouterProvider,
} from 'react-router-dom';
import api from './api';

const APP_PATH: string = "/apps/pantheon";

export function App() {
  const [apiData, setApiData] = useState({key: "", valid: false});

  // TODO: How do we always insist on returning to the main path
  // if the user hasn't provided an API key?

  // TODO: Needs to be a simple form awaiting API key, hopefully w/
  // v. simple validation. This should redirect to '/' after a
  // successful poke to restart the process.
  const KeyForm = () => (<h1 className="text-3xl">Need a key!</h1>);
  // TODO: Just needs to have a list of files associated with the
  // user as <li>.
  const ApiForm = () => {
    const abc: object = useLoaderData();
    console.log(abc);

    return (
      <h1 className="text-3xl">Have key {apiData.key}</h1>
    );
  };

  const router = createBrowserRouter([
    { // redirect if API key isn't set; fetch API key first
      path: APP_PATH,
      loader: async () => {
        if(apiData.key === "") {
          // const curKey: string = await api.scry<string>(
          //   {app: 'pantheon-agent', path: '/key'}).then(() =>
          //     "cool"
          // );
          const curKey: string = "bad";
          return setApiData({key: curKey, valid: true});
        } else {
          return redirect(apiData.valid ? "./api" : "./key");
        }
      },
    },
    { // simple form that takes an API key and pokes the back-end agent with it
      path: [APP_PATH, "key"].join("/"),
      element: <KeyForm />,
    },
    { // simple view that shows all files associated with an API key
      path: [APP_PATH, "api"].join("/"),
      element: <ApiForm />,
      loader: async () => (
        json({files: ["a", "b", "c"]}, {status: 200})
      ),
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

// export function App() {
//   const [apps, setApps] = useState<Charges>();
//
//   useEffect(() => {
//     async function init() {
//       const charges = (await api.scry<ChargeUpdateInitial>(scryCharges)).initial;
//       setApps(charges);
//     }
//
//     init();
//   }, []);
//
//   return (
//     <main className="flex items-center justify-center min-h-screen">
//       <div className="max-w-md space-y-6 py-20">
//         <h1 className="text-3xl font-bold">Welcome to pantheon</h1>
//         <p>Here&apos;s your urbit&apos;s installed apps:</p>
//         {apps && (
//           <ul className="space-y-4">
//             {Object.entries(apps).map(([desk, app]) => (
//               <li key={desk} className="flex items-center space-x-3 text-sm leading-tight">
//                 <AppTile {...app} />
//                 <div className="flex-1 text-black">
//                   <p>
//                     <strong>{app.title || desk}</strong>
//                   </p>
//                   {app.info && <p>{app.info}</p>}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </main>
//   );
// }
