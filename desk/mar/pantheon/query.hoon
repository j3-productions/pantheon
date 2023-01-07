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
      :~  ['cid' s+cid.file]
          ['name' s+name.file]
          :+  'tags'  %a
          %+  turn  tags.file
          |=  [=tag:pantheon]
          %-  pairs
          :~  ['id' s+id.tag]
              ['name' s+name.tag]
              ['slatename' s+slatename.tag]
          ==
      ==
      ::
        %search
      %-  pairs
      %+  turn  (tap:on-files files.query)
      |=  [=cid:pantheon =file:pantheon]
      :-  cid
      %-  pairs
      :~  ['cid' s+cid.file]
          ['name' s+name.file]
          :+  'tags'  %a
          %+  turn  tags.file
          |=  [=tag:pantheon]
          %-  pairs
          :~  ['id' s+id.tag]
              ['name' s+name.tag]
              ['slatename' s+slatename.tag]
          ==
      ==
    ==
  --
++  grad  %noun
--
