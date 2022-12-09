::
::  sur/pantheon
::
|%
+$  key   @t
+$  cid   @t
+$  tag
  $:  id=@t
      name=@t
      slatename=@t
  ==
+$  file
  $:  cid=cid
      name=@t
      tags=(list tag)
::    blurhash=(unit @t)
::    body=@t
::    cover-image=(unit @t)
::    created-at=@da
::    download-count=@ud
::    save-count=@ud
::    size=@ud
::    filename=@t
::    id=@t
::    is-public=@f
::    owner-id=@t
::    url=@t
::    :: TODO: This probably exists as an enumerated sequence somewhere.
::    type=@t
::    :: TODO: This could all probably be combined into a single type w/ a unit.
::    is-link=@f
::    link-author=(unit @t) :: (unit @p)?
::    link-body=(unit @t)
::    link-domain=(unit @t) :: web address
::    link-favicon=(unit @t) :: web address
::    link-html=(unit @t) :: web address
::    link-iframe-allowed=(unit @f)
::    link-image=(unit @t)
::    link-name=(unit @t)
::    link-source=(unit @t)
::    :: TODO: What do these variables represent?
::    data=(unit ?)
::    old-data=(unit ?)
  ==
+$  files  ((mop cid file) gth)
+$  query
  $%  [%key =key]
  ==
+$  action
  $%  [%add-key =key]
  ==
:: +$  update
::   $%  :: TODO
::   ==
--
