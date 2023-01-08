::  her
::  app/pantheon-agent
::
::  TODO: Add permissions surrounding the 'key' value.
/-  *pantheon
/+  default-agent, dbug, agentio, gossip
/$  grab-file  %noun  %pantheon-file
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
  ++  on-files  ((on cid file) gth)
  --
  ::
  ::
  %-  agent:dbug
  =|  state-0
  =*  state  -
  %-  %+  agent:gossip
     [1 %mutuals %mutuals]
    %+  ~(put by *(map mark $-(* vase)))
      %file
    |=(n=* !>((grab-file n)))
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
        ::
        :: Grab file matching cid and modify privacy
        =/  nu
          =+  (~(got by files) cid.act)
          =.  privacy.-  priv.act  -
        ::
        :: Prepare get request for collections
        =/  http-files=request:http
          :^  %'GET'  'https://slate.host/api/v3/get'
          ~[['content-type' 'application/json'] ['Authorization' key]]  ~
        :_  this(files (~(put by files) cid.act nu))
        ?:  &((is-new nu files) ?!(=(priv.act %private)))
          :-  [(fact:io file+!>(nu) ~[/~/gossip/source])]
          :~   %-  ~(arvo pass:io /edit/(scot %tas slate-id.act)/(scot %tas cid.act)/(scot %tas priv.act)/(scot %tas name.act))
              [%i %request http-files *outbound-config:iris]
          ==
        :~   %-  ~(arvo pass:io /edit/(scot %tas slate-id.act)/(scot %tas cid.act)/(scot %tas priv.act)/(scot %tas name.act))
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
        [%x %search @ @ @ @ ~]
      =/  name  -.+.+.path
      =/  ext  -.+.+.+.path
      =/  priv  -.+.+.+.+.path
      =/  own=(unit @p)  (slaw %p -.+.+.+.+.+.path)
      ``pantheon-query+!>(`query`[%files (search name ext priv own)])
    ==
  ::
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
      ~(tap by files)
    |=(f=[p=cid q=file] |(&(=(privacy.q.f %pals) =(owner.q.f our.bowl)) =(privacy.q.f %public)))
  |=(f=[p=cid q=file] (fact-init:io file+!>(q.f)))
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
       ~[(fact:io file+!>(file) ~[/~/gossip/source])]
  this(files (~(put by files) cid.file file))
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
      ::  J: purpose of this sequence is to grab 'cols'
      ?>  ?=([%o *] u.jon)
      ~&  >  '%pantheon: syncing files'  :: u.jon
      =+  cols=(~(got by p.u.jon) 'collections')
      ?>  ?=([%a *] cols)
      =+  cols=p.cols
      =/  fetched-files=(list file)
      %-  turn  :_
                ::  grab previous privacy setting if exists, otherwise private
                ::  add owner as us, since we fetched from our slate.
                |=
                f=$:(collection=@t cid=cid name=@t tags=(list tag) type=@t islink=?(%.y %.n))
                ^-  file
                =/  funit=(unit file)  (~(get by files) cid.f)
                ?~  funit
                  [our.bowl [%private f]]
                =+  stored-file=(need funit)
                [our.bowl [privacy.stored-file f]]
      ^-  (list $:(collection=@t cid=cid name=@t tags=(list tag) type=@t islink=?(%.y %.n)))
      %-  zing
      |-
        ?~  cols  ~
        =+  col=i.cols
        ?>  ?=([%o *] col)
        =+  col-id=(~(got by p.col) 'id')
        ?>  ?=([%s *] col-id)
        =+  objs=(~(got by p.col) 'objects')
        ?>  ?=([%a *] objs)
        :_  $(cols t.cols)
        %+  turn  p.objs
        =,  dejs:format
        |=  obj=json
        ;;  $:(collection=@t cid=cid name=@t tags=(list tag) type=@t islink=?(%.y %.n))
        :-  p.col-id
        %.  obj
        %-  ot
        :~  [%cid so]
            [%name so]
            :: NOTE: This is necessary because the 'tags' field on the
            :: JSON data can be either a list of tags or null; this
            :: catches the null case and returns it as an empty list.
            :-  %tags
            |=  j=json
            ^-  (list tag)
            ?.  ?=([%a *] j)  ~
            ((ar (ot ~[id+so name+so slatename+so])) j)
            [%type so]
            [%'isLink' bo]
        ==
      ::  merge the fetched files with our files
      ::  don't just overwrite so we don't lose gossip-received data
      ::
      `this(files (~(uni by files) (malt (turn fetched-files |=([=file] [cid.file file])))))
      ::  emit gossip cards of those files that are new and have the right privacy setting.
      ::
      ::%+  turn
      ::  %+  skim
      ::    %+  skim
      ::      fetched-files
      ::    (curr is-new files)
      ::  |=(f=file |(=(privacy.q.f %pals) =(privacy.q.f %public)))
      ::|=(f=file (fact:io file+!>(f) ~[/~/gossip/source]))
    ==
      ::
        [%edit @ @ @ @ ~]
      ?+    sign-arvo  (on-arvo:default wire sign-arvo)
          [%iris %http-response %finished *]
        =+  res=full-file.client-response.sign-arvo
        ?~  res  (on-arvo:default wire sign-arvo)
        =+  jon=(de-json:html `@t`q.data.u.res)
        ?~  jon  (on-arvo:default wire sign-arvo)
        ?>  ?=([%o *] u.jon)
        =+  cols=(~(got by p.u.jon) 'collections')
        ?>  ?=([%a *] cols)
        ::
        ::  Grab collection with matching slate id,
        =/  col
        %+  snag  0
        %+  skim
          p.cols
        |=  jawn=json
        ?>  ?=([%o *] jawn)
        =/  slate-id  (~(got by p.jawn) 'id')
        ?>  ?=([%s *] slate-id)
        =(p.slate-id -.+.wire)
        ?>  ?=([%o *] col)
        =+  objs=(~(got by p.col) 'objects')
        ?>  ?=([%a *] objs)
        ::
        ::  Grab file with matching cid,
        =/  fil
        %+  snag  0
        %+  skim
        p.objs
        |=  jawn=json
        ?>  ?=([%o *] jawn)
        =/  sid  (~(got by p.jawn) 'cid')
        ?>  ?=([%s *] sid)
        =(p.sid -.+.+.wire)
        ?>  ?=([%o *] fil)
        ::
        ::  Change name of file,
        =.  p.fil  (~(put by p.fil) 'name' [%s p=-.+.+.+.+.wire])
        ::
        ::  Package file into json format with 'data' key,
        =/  updated=json  [%o (malt ~[['data' fil]])]
        ::
        ::  Send http request to update name of file.
        =/  http-files=request:http
        :^  %'POST'  'https://slate.host/api/v3/update-file'
        ~[['content-type' 'application/json'] ['authorization' key]]
        `(as-octt:mimes:html (en-json:html updated))
        :_  this
        :~  (~(arvo pass:io /reply) [%i %request http-files *outbound-config:iris])
        ==
      ==
      ::
        [%reply ~]
      ?+    sign-arvo  (on-arvo:default wire sign-arvo)
          [%iris %http-response %finished *]
        =+  res=full-file.client-response.sign-arvo
        ?~  res  (on-arvo:default wire sign-arvo)   :: no body in response
        =+  jon=(de-json:html `@t`q.data.u.res)
        ~&  >  jon
        `this
      ==
    ==
  ::
  ++  on-fail   on-fail:default
  --
::
::  helper core
|%
++  is-new
  |=  [f=file fs=^files]
  ^-  ?(%.y %.n)
  =/  existing=(unit file)  (~(get by fs) cid.f)
  ?~  existing
    %.y
  ?!(=((need existing) f))
++  search
  |=  [name=@t ext=@t priv=@tas own=(unit @p)]
  ^-  ^files
  ::  grab files
  %-  malt
  %+  skim
      ~(tap by files)
  |=  [key=cid val=file]
  ^-  @f
  ?&  ?~  name  %&  (find-name name name.val)
      ?~  priv  %&  =(priv privacy.val)
      ?~  ext  %&  (find-ext ext type.val)
      ?~  own  %&  (find-own (need own) owner.val)
  ==
 ::  Setting these as arms rather than inline because I expect them to grow
 ::  more complex once we expand search capabilities
++  find-name  |=([a=@t b=@t] =(a b))
++  find-ext
  |=  [a=@ b=@t]
  ?:  =('link' b)
    =(a b)
  =(a +:(scan (trip b) ;~((glue fas) sym sym)))
++  find-own  |=([a=@p b=@p] =(a b))
--
