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
--
::
::
%-  agent:dbug
=|  state-0
=*  state  -
=<
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
      :-
      %-  ~(arvo pass:io /files/(scot %tas merge.act))
      [%i %request http-files *outbound-config:iris]
      %+  turn
        %+  skim
          (tap:files-orm files)
        |=(f=[p=cid q=file] =(privacy.q.f %pals))
      |=(f=[p=cid q=file] [%give %fact ~ %file !>(q.f)])  
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
::  case for files youve seen vs own
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?:  ?=([%http-response *] path)  [~ this]
  ?.  =(/~/gossip/source path)
    (on-watch:default path)
  :_  this
  %+  turn
    %+  skim
      (tap:files-orm files)
    |=(f=[p=cid q=file] =(privacy.q.f %pals))
  |=(f=[p=cid q=file] [%give %fact ~ %file !>(q.f)])
:: send out files
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
  `this(files (put:files-orm files cid.file file))
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
      =/  merge=merge-strategy  %theirs  :: +<.wire
      =;  new-files=_files  `this(files new-files)
      %-  malt
      %-  turn  :_  |=([=file] [cid.file file])
      ^-  (list file)
      %-  zing
      |-
        ?~  cols  ~
        =+  col=i.cols
        ?>  ?=([%o *] col)
        =+  objs=(~(got by p.col) 'objects')
        ?>  ?=([%a *] objs)
        ::  TODO: Figure out how to merge incoming `mop` with existing
        ::  `mop` of CIDs (just replace it?, keep the overlap?)
        ::  TODO: Get rid of empty entry that's introduced in this list
        ::  (perhaps by the initial bunt?)
        :_  $(cols t.cols)
        %+  turn  p.objs
        =,  dejs:format
        |=  obj=json
        ;;  file
        :-  our.bowl  ::we are the owners of the files
        :-  %private  ::automatically set gossip level to private
        %.  obj
        %-  ot
        :~  [%cid so]
            [%name so]
            [%tags (ar (ot ~[id+so name+so slatename+so]))]
            [%'isLink' bo]
        ==
    ==
  ==
::
++  on-fail   on-fail:default

--
|%
::  shorthand for mop function usage
::
++  files-orm  ((on cid file) gth)
--