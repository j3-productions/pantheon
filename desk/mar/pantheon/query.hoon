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
    ==
  --
++  grad  %noun
--
