/-  pantheon
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
      %+  turn  ~(tap by files.query)
      |=  [=cid:pantheon =file:pantheon]
      :-  cid
      %-  pairs
      :~  ['owner' (ship owner.file)]
          ['privacy' s+privacy.file]
          ['collection' s+collection.file]
          ['cid' s+cid.file]
          ['name' s+name.file]
          :+  'tags'  %a
          %+  turn  tags.file
          |=  [=tag:pantheon]
          %-  pairs
          :~  ['id' s+id.tag]
              ['name' s+name.tag]
              ['slatename' s+slatename.tag]
          ==
          ['type' s+type.file]
          ['islink' b+islink.file]
      ==
    ==
  --
++  grad  %noun
--
