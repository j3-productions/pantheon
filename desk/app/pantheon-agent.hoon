::
::  app/pantheon-agent
::
::  TODO: Add permissions surrounding the 'key' value.
::
/-  *pantheon
/+  default-agent, dbug
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
^-  agent:gall
|_  =bowl:gall
+*  this      .
    default   ~(. (default-agent this %.n) bowl)
    helper    ~(. +> bowl)
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
      :_  this  :_  ~
      :*  %pass  /files  %arvo  %i
          %request  http-files  *outbound-config:iris
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
      [%files ~]
    ?+    sign-arvo  (on-arvo:default wire sign-arvo)
        [%iris %http-response %finished *]
      =+  res=full-file.client-response.sign-arvo
      ?~  res  (on-arvo:default wire sign-arvo)   :: no body in response
      =+  jon=(de-json:html `@t`q.data.u.res)
      ?~  jon  (on-arvo:default wire sign-arvo)   :: json parse failure
      ::  TODO: Is there a better way to do this (maybe using marks)?
      ?>  ?=([%o *] u.jon)
      =+  col=(~(got by p.u.jon) 'collections')
      ?>  ?=([%a *] col)
      =+  obj=(snag 0 p.col)
      ?>  ?=([%o *] obj)
      =+  files=(~(got by p.obj) 'objects')
      ::  TODO: Need to now churn these files into compliant data
      ::  structure, i.e. something resembling `((mop cid file) gth)`
      ::  TODO: Figure out how to merge incoming `mop` with existing
      ::  `mop` of CIDs (just replace it?, keep the overlap?)
      ~&(files `this)
    ==
  ==
::
++  on-fail   on-fail:default
--
