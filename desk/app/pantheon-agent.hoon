::
::  app/pantheon-agent
::
::  TODO: Add permissions surrounding the 'key' value.
::
/-  *pantheon
/+  default-agent, dbug, agentio, *pantheon, gossip
/$  grab-file  %noun  %file
::
::

|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0
  $:  %0
      =key
      =files
  ==
+$  card  card:agent:gall
::  shorthand for mop function usage
::
++  files-orm  ((on cid file) gth)
::  check if a file is new/different or already stored
::
++  is-new
  |=  [f=file fs=files]
  ^-  ?(%.y %.n)
  =/  existing=(unit file)  (get:files-orm fs cid.f)
  ?~  existing
    %.y
  ?!(=((need existing) f))
--
::
::
%-  agent:dbug
=|  state-0
=*  state  -
%-  %+  agent:gossip
      [1 %anybody %anybody]
    %+  ~(put by *(map mark $-(* vase)))
      %file
    |=(n=* !>((grab-file n)))

^-  agent:gall
|_  =bowl:gall
+*  this      .
    default   ~(. (default-agent this %.n) bowl)
    helper    ~(. +> bowl)
    io  ~(. agentio bowl)
::
++  on-init
  ^-  (quip card _this)
  `this
::
++  on-save
  ^-  vase
  !>(state)
::
++  on-load
  |=  old-state=vase
  ^-  (quip card _this)
  =/  old  !<(versioned-state old-state)
  ?-  -.old
    %0  `this(state old)
  ==
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+    mark  (on-poke:default mark vase)
      %pantheon-action
    =/  act  !<(action vase)
    ?-    -.act
        %add-key
      `this(key key.act)
    ::
        %sync-files
      =/  http-files=request:http
        :^  %'GET'  'https://slate.host/api/v3/get'
        ~[['content-type' 'application/json'] ['Authorization' key]]  ~
      :_  this
      :~  %-  ~(arvo pass:io /files/(scot %tas merge.act))
        [%i %request http-files *outbound-config:iris]
      ==
    ==
  ==
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+    path  (on-peek:default path)
      [%x %key ~]
    ``pantheon-query+!>(`query`[%key key])
  ::
      [%x %files ~]
    ``pantheon-query+!>(`query`[%files files])
  ==

++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?:  ?=([%http-response *] path)  [~ this]
  ?.  =(/~/gossip/source path)
    (on-watch:default path)
  :_  this
  ::  send out all of our files that either we own and set privacy to pals, or we know and privacy is public.
  ::
  %+  turn
    %+  skim
      (tap:files-orm files)
    |=(f=[p=cid q=file] |(&(=(privacy.q.f %pals) =(owner.q.f our.bowl)) =(privacy.q.f %public)))
  |=(f=[p=cid q=file] [%give %fact ~ %file !>(q.f)])
::
++  on-leave  on-leave:default
::
++  on-agent
|=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?.  ?&  =(/~/gossip/gossip wire)
          ?=(%fact -.sign)
          =(%file p.cage.sign)
      ==
    ~&  [dap.bowl %strange-sign wire sign]
    (on-agent:default wire sign)
  =+  !<(=file q.cage.sign)
  ::  gossip out a received file if it is public and we haven't seen it before.
  ::
  :-  ?.  &((is-new file files) =(privacy.file %public))  ~
      [[%give %fact [/~/gossip/source]~ %file !>(file)] ~]
  this(files (put:files-orm files cid.file file))

::  getting files
:: distinguish files you saw vs your files
++  on-arvo
  |=  [=wire =sign-arvo]
  ^-  (quip card _this)
  ?+    wire  (on-arvo:default wire sign-arvo)
      [%files @ ~]
    ?+    sign-arvo  (on-arvo:default wire sign-arvo)
        [%iris %http-response %finished *]
      =+  res=full-file.client-response.sign-arvo
      ?~  res  (on-arvo:default wire sign-arvo)   :: no body in response
      =+  jon=(de-json:html `@t`q.data.u.res)
      ?~  jon  (on-arvo:default wire sign-arvo)   :: json parse failure
      ::  TODO: Is there a better way to do this (maybe using marks)?
      ::  J: purpose of this sequence is to grab 'cols'
      ?>  ?=([%o *] u.jon)
      =+  cols=(~(got by p.u.jon) 'collections')
      ?>  ?=([%a *] cols)
      =+  cols=p.cols
      =/  fetched-files=(list file) 
      %-  turn  :_
                ::  grab previous privacy setting if exists, otherwise private
                ::  add owner as us, since we fetched from our slate.
                |=
                f=$:(cid=cid name=@t tags=(list tag) islink=?(%.y %.n))
                ^-  file
                =/  funit=(unit file)  (get:files-orm files cid.f)
                ?~  funit 
                  [our.bowl [%private f]]
                =+  stored-file=(need funit)
                [our.bowl [privacy.stored-file f]]
      ^-  (list $:(cid=cid name=@t tags=(list tag) islink=?(%.y %.n)))
      %-  zing
      |-
        ?~  cols  ~
        =+  col=i.cols
        ?>  ?=([%o *] col)
        =+  objs=(~(got by p.col) 'objects')
        ?>  ?=([%a *] objs)
        :_  $(cols t.cols)
        %+  turn  p.objs
        =,  dejs:format
        |=  obj=json
        ;;  $:(cid=cid name=@t tags=(list tag) islink=?(%.y %.n))
        %.  obj
        %-  ot
        :~  [%cid so]
            [%name so]
            [%tags (ar (ot ~[id+so name+so slatename+so]))]
            [%'isLink' bo]
        ==
      ::  merge the fetched files with our files 
      ::  don't just overwrite so we don't lose gossip-received data
      ::
      `this(files (uni:files-orm files (malt (turn fetched-files |=([=file] [cid.file file])))))
      ::  emit gossip cards of those files that are new and have the right privacy setting.
      ::
      ::%+  turn
      ::  %+  skim
      ::    %+  skim
      ::      fetched-files
      ::    (curr |=([f=file fs=^files] %.y) *files)
      ::  |=(f=file |(=(privacy.q.f %pals) =(privacy.q.f %public)))
      ::|=(f=file [%give %fact [/~/gossip/source]~ %file !>(f)])
    ==
  ==
::
++  on-fail   on-fail:default
--