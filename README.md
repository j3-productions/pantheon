## Introduction
`%pantheon` is an Urbit app which allows hosting, curation, and discovery of arbitrary files, using the IPFS-based service [Slate](https://slate.host) as a method of interacting with the 30GB of free IPFS-based storage provided via Slate and all of its associated metadata. To enable file sharing and discovery across the network, `%pantheon` performs gossip-based metadata propagation and provides associated search features.

### Motivation
Urbit's single-level store architecture has historically made it difficult to host and share memory-intensive media on the platform. While upcoming core infrastructure improvements will assuage this somewhat, it's likely that Urbit will continue to rely on externally hosted storage for data sharing into the foreseeable future. Currently, attempts to address this include Urbit's integration of Amazon S3 storage solutions, which allows uploading and displaying images in `%landscape`, and the upcoming [`%trove`](https://urbit.org/grants/trove) application, which will expand file sharing to more general forms of media and provide more granular controls for sharing.

While the use of Amazon S3 has been a good stopgap, self-hosting the service is notoriously tricky, and S3 has inherent limits while not living up to Urbit’s decentralized ideals. And while `%trove` aims for both S3 and IPFS integration while allowing groups of ships to share and collaborate on files and folders Dropbox-style, it does not aim to provide a solution for global curation and sharing of files.

We hope for `%pantheon` to be a first step towards apps that enable network-wide search and discovery on Urbit, as well as advancing IPFS as a Web3-native, decentralized option for Urbit file storage.

## Setup

### Dependencies
To obtain full functionality of `%pantheon` the `%pals` app must also be installed. Installation instructions for both `%pals` and `%pantheon` are the same and they provided below.

### Install via Landscape (Recommended Method)
To install `%pantheon`:
1. Open up Landscape app, in the search bar type: `~dister-dister-sidnym-ladrut`.

2. Click on `~sidnym^ladrut`.
![img](https://i.imgur.com/2rzpu0D.png)

3. Under apps distributed by `~sidnym^ladrut`, click on Pantheon
![img](https://i.imgur.com/FQtqgw1.png)

4. Press the 'Get App' button. After installation, the app tile should appear on your grid.
![img](https://i.imgur.com/v1dn8W9.png)

To install `%pals`, type `~paldev` in the Landscape search bar and repeat steps 2-4 with `~paldev` instead of `~sidnym^ladrut`

### Install From Command Line (For Power Users)
In your `dojo` paste in:

```
|install ~paldev %pals
|install ~dister-dister-sidnym-ladrut %pantheon
```

## Using Pantheon

### Hook up slate to urbit
1. After `%pantheon` has been installed, you should be able to see the icon on your grid.
2. In the landing page of the app is a link to sign up for Slate. If do not already have a Slate account, you can follow the instructions to obtain an account.
3. To hook your Slate up to your urbit, you must provide it with an API key. Go to your Slate homepage at slate.host, click on your icon in the top left corner of the screen. Click on the 'API' option.
  ![img](https://i.imgur.com/giVPKlP.png)
4. Inside of the API Key screen, click on 'generate' to create an API key.
  ![img](https://imgur.com/JY2jrmN.png)
5. Paste this API key inside of the API key box.
  ![img](https://i.imgur.com/8XOFTlW.png)
6. If your API key was valid, you should now see the files stored in your Slate.
  ![img](https://i.imgur.com/HbyzW1n.png)

## Search Functionality

### Simple Search
You can use the search bar to search over file names.
1. The search bar can also be expanded to reveal search criteria such as file extension, privacy level, and file owner. To expand the search bar, click on the downward caret to the left of the magnifying glass icon.
  ![img](https://i.imgur.com/XD4R4Gg.png)

2. Fill out all parameters you'd like filtered in your search query (the search is the logical AND of all requested parameters, e.g. extension is png AND privacy is public) and then press the magnifying glass button or hit the "Enter" key to obtain the results.
  ![img](https://i.imgur.com/1Sh2nt5.png)

### Search inside your pals network
You can see files around the network if you are mutual pals with at least one other Urbit ship with `%pantheon` installed. To see a list of all public files, set the privacy filter to "Public". To see only your own files, set it to "Private". 
  ![img](https://i.imgur.com/KB4o5Ny.png)

You can search for files from a specific Urbit ship with the "Author" field.


## Gossiping Files
Make sure you are mutual pals with at least one other Urbit ship that has `%pantheon` installed. To gossip a file, click on it, click the info button in the top right corner, click the edit button, and set the privacy to either "Pals only" or "Public". You can only gossip files that belong to you.
  ![img](https://i.imgur.com/U8tHnVd.png)
  ![img](https://i.imgur.com/G9I4b0k.png)

