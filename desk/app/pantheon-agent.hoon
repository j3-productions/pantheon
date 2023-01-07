::
::  app/pantheon-agent
::
::  TODO: Add permissions surrounding the 'key' value.
/-  *pantheon
/+  default-agent, dbug, agentio, *pantheon
::
:: :: here
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
  ^-  agent:gall
  =<
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
      ::
          %edit-metadata  :: includes privacy
        :: Send HTTP GET REQUEST -> HANDLE IN ON-ARVO -> EMIT ARVO CARD
      ::  `this
        =/  http-files=request:http
          :^  %'GET'  'https://slate.host/api/v3/get'
          ~[['content-type' 'application/json'] ['Authorization' key]]  ~
        :_  this
        :~  %-  ~(arvo pass:io /edit/(scot %tas slatename.act)/(scot %tas cid.act)/(scot %tas priv.act)/(scot %tas name.act))
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
    ::
    ::  %x %search name /ext public
        [%x %search @ @ @ ~]
      =/  name  -.+.+.path
      =/  ext  -.+.+.+.path
      =/  priv  -.+.+.+.+.path
      ``pantheon-query+!>(`query`[%files (search name ext priv)])
    ==
  ::
  ++  on-watch  on-watch:default
  ::
  ++  on-leave  on-leave:default
  ::
  ++  on-agent  on-agent:default
  ::
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
        ?>  ?=([%o *] u.jon)
        =+  cols=(~(got by p.u.jon) 'collections')
        ?>  ?=([%a *] cols)
        =+  col=(snag 0 p.cols)
        ?>  ?=([%o *] col)
        =+  objs=(~(got by p.col) 'objects')
        ?>  ?=([%a *] objs)
        ::  TODO: Figure out how to merge incoming `mop` with existing
        ::  `mop` of CIDs (just replace it?, keep the overlap?)
        ::  TODO: Get rid of empty entry that's introduced in this list
        ::  (perhaps by the initial bunt?)
        =/  merge=merge-strategy  %theirs  :: +<.wire
        =;  new-files=_files  `this(files new-files)
        %-  malt
        %-  turn  :_  |=([=file] [cid.file file])
        %+  turn  p.objs
        =,  dejs:format
        |=  obj=json
        ;;  file
        %.  obj
        %-  ot
        :~  [%cid so]
            [%name so]
            [%tags (ar (ot ~[id+so name+so slatename+so]))]
            [%type so]
            [%'isLink' bo]
            [%'isPublic' bo]
        ==
      ==
        [%edit @ @ @ @ ~]
      ?+    sign-arvo  (on-arvo:default wire sign-arvo)
          [%iris %http-response %finished *]
        =+  res=full-file.client-response.sign-arvo
        ?~  res  (on-arvo:default wire sign-arvo)   :: no body in response
        =+  jon=(de-json:html `@t`q.data.u.res)
        ?~  jon  (on-arvo:default wire sign-arvo)   :: json parse failure
        ?>  ?=([%o *] u.jon)
        =+  cols=(~(got by p.u.jon) 'collections')
        ?>  ?=([%a *] cols)
        =+  col=(snag 0 p.cols)
        ?>  ?=([%o *] col)
        =+  slatename=(~(got by p.col) 'slatename')
        ?>  ?=([%s *] slatename)
        ~&  >  p.slatename 
        =+  objs=(~(got by p.col) 'objects')
        ?>  ?=([%a *] objs)
        ~&  >  objs
        =+  fil=(snag 0 p.objs)
        ~&  >  fil
        ?>  ?=([%o *] fil)
        ~&  >  (~(got by p.fil) 'filename')
        ~&  >  (~(put by p.fil) 'filename' [%s p='somefile'])
        `this
      ==
    ==
  ::
  ++  on-fail   on-fail:default
  --
::
::  helper core
|%  
++  search 
  |=  [name=@t ext=@t vis=@ta]
  ^-  ^files
  ::  grab files
  %-  malt
  %+  skim
      (tap:on-files files)
  |=  [key=cid val=file]
  ^-  @f
  ?&  ?:(=(vis %public) ispublic.val !ispublic.val)
      ?|  (find-name name name.val)
          (find-ext ext type.val)
      ==
  ==
  
++  find-name  |=([a=@t b=@t] =(a b))
++  find-ext  |=([a=@t b=@t] =(a +:(scan (trip b) ;~((glue fas) sym sym))))
--
