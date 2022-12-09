::
::  app/pantheon-agent
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
    ==
  ==
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+    path  (on-peek:default path)
      [%x %key ~]
    ``pantheon-query+!>(`query`[%key key])
  ==
::
++  on-watch  on-watch:default
::
++  on-leave  on-leave:default
::
++  on-agent  on-agent:default
::
++  on-arvo   on-arvo:default
::
++  on-fail   on-fail:default
--
