# `%pantheon` #

`%pantheon` is an [Urbit] app which allows hosting, curation, and discovery of
arbitrary files, using the IPFS-based service [Slate](https://slate.host) as a
method of interacting with the 30GB of free IPFS-based storage provided via
Slate and all of its associated metadata. To enable file sharing and discovery
across the network, `%pantheon` performs gossip-based metadata propagation and
provides associated search features. The application is implemented with a
standard [Gall agent][urbit-agent] back-end and a [React]/[Tailwind CSS]
front-end.

## Demo ##

![%pantheon demo](https://github.com/sidnym-ladrut/pantheon/raw/master/dat/pantheon-demo.gif)

## Install ##

While technically an optional dependency, the `%pals` app should be installed
with `%pantheon` to access the latter's complete functionality. Consequently,
the installation instructions below detail how to install each of these apps.

### Grid GUI (Recommended) ###

Within your Urbit ship's web interface, navigate to the home screen
(i.e. `/apps/grid/`) and do the following:

1. In the search bar, type in: `~dister-dister-sidnym-ladrut`.
1. Click on `~sidnym^ladrut`.
   ![img](https://github.com/sidnym-ladrut/quorum/raw/main/dat/install-1.png)
1. Under apps distributed by `~sidnym^ladrut`, click on 'Pantheon.'
   ![img](https://github.com/sidnym-ladrut/quorum/raw/main/dat/install-2.png)
1. Press the 'Get App' button. After installation, the app tile should appear.

To install `%pals`, type `~paldev` into the search bar and repeat steps 2-4
with `~paldev` instead of `~sidnym^ladrut`.

### Dojo CLI ###

Within your Urbit ship's command-line interface, enter the following command(s):

```bash
> |install ~paldev %pals
> |install ~dister-dister-sidnym-ladrut %pantheon
```

## Build/Develop ##

For development, we recommend creating a [fake `~zod`][fakezod] and deploying
the repo's `/desk` subdirectory to this ship's `%pantheon` desk. We reference the
following paths in the workflows below:

```bash
$ export PANTHEON_UI=/path/to/pantheon/ui/
$ export PANTHEON_DESK=/path/to/pantheon/desk/
$ export FAKEZOD_DESK=/path/to/zod/pantheon/
```

### First-time Setup ###

The following commands should be executed after each fresh clone of the project
to set up the [Vite] and the UI development environment:

```bash
$ cd $PANTHEON_UI
$ npm install
$ echo "VITE_SHIP_URL=http://127.0.0.1:8080" >> .env.local
```

Subsequently, run the following commands to create a new [fake `~zod`][fakezod]
and create a container desk `%pantheon`:

```bash
$ cd $FAKEZOD_DESK/../../
$ urbit -F zod -B $(([ -f urbit-v1.17.pill ] || curl -LO bootstrap.urbit.org/urbit-v1.17.pill) && echo "urbit-v1.17.pill")
> |merge %pantheon our %base
> |mount %pantheon
$ rm -rI $FAKEZOD_DESK/*
$ cd $PANTHEON_DESK
$ rsync -uLrvP ./ $FAKEZOD_DESK/
> |commit %pantheon
> |install our %pantheon
```

### Development Workflows ###

#### Back-end Workflows ####

In order to test back-end code changes, run the following commands:

```bash
> |nuke %pantheon-agent
$ cd $PANTHEON_DESK
$ rsync -uLrvP ./ $FAKEZOD_DESK/
> |commit %pantheon
> |revive %pantheon
```

#### Front-end Workflows ####

In order to test front-end code changes, run the following commands
(these only need to be run once per development session; [Vite] hot swaps
assets when changes are saved):

```bash
$ cd $PANTHEON_UI
$ npm run dev
```

Also, be sure to authenticate via both the NPM web portal (default:
`localhost:3000`) and the development ship's web portal ([fake `~zod`][fakezod]
default: `localhost:8080`).

### Deployment Workflow ###

In order to test the web package deployment process for the current
front-end build, run the following commands:

```bash
$ cd $PANTHEON_UI
$ npm run build
$ rsync -avL --delete ./dist/ $FAKEZOD_DESK/pantheon/
> |commit %pantheon
> -garden!make-glob %pantheon /pantheon
$ cd $FAKEZOD_DESK/../.urb/put
$ sed -r "s/(glob-http\+\[).*(\])/\1\'http:\/\/127.0.0.1:8000\/$(ls | grep glob)\' $(ls | grep glob | sed -r 's/glob-(.*)\.glob/\1/g')\2/g" -i ../../pantheon/desk.docket-0
$ python3 -m http.server 8000
> |commit %pantheon
```


[urbit]: https://urbit.org
[urbit-agent]: https://developers.urbit.org/reference/glossary/agent
[fakezod]: https://developers.urbit.org/guides/core/environment#development-ships
[react]: https://reactjs.org/
[tailwind css]: https://tailwindcss.com/
[vite]: https://vitejs.dev/
