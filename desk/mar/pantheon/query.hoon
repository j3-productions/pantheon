/-  pantheon
/+  *pantheon
|_  =query:pantheon
++  grab
  |%
  ++  noun  query:pantheon
  --
++  grow
  |%
  ++  noun  query
  ++  json
    =,  enjs:format
    ^-  ^json
    ?-    -.query
        %key
      (pairs ['key' s+key.query]~)
      ::
        %files
      %-  pairs
      %+  turn  (tap:on-files files.query)
      |=  [=cid:pantheon =file:pantheon]
      :-  cid
      %-  pairs
      :~  ['owner' (ship owner.file)]
          ['privacy' s+privacy.file]
          ['cid' s+cid.file]
          ['name' s+name.file]
          :-  %tags
          |=  j=json
          ^-  (list tag)
          ?.  ?=([%a *] j)
            ~
          ((ar (ot ~[id+so name+so slatename+so])) j)
          ['type' s+type.file]
          ['islink' b+islink.file]
      ==
    ==
  --
++  grad  %noun
--
