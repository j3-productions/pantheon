::
::  sur/pantheon
::
|%
+$  key  @t
+$  cid  @t
+$  merge-strategy  ?(%ours %theirs %union %intersect)
+$  gossip-privacy  ?(%private %pals %public)
+$  tag
  $:  id=@t
      name=@t
      slatename=@t
  ==
+$  file
  $:  owner=@p
      privacy=gossip-privacy
      cid=cid
      name=@t
      tags=(list tag)
      type=@t
      islink=?(%.y %.n)
::    ispublic=?(%.y %.n)
::    blurhash=(unit @t)
::    body=@t
::    cover-image=(unit @t)
::    created-at=@da
::    download-count=@ud
::    save-count=@ud
::    size=@ud
::    id=@t
::    owner-id=@t
::    url=@t
::    :: TODO: This probably exists as an enumerated sequence somewhere.
::    :: TODO: This could all probably be combined into a single type w/ a unit.
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
+$  files        ((mop cid file) gth)
+$  query
  $%  [%key =key]
      [%files =files]
  ==
+$  action
  $%  [%add-key =key]
      [%sync-files merge=merge-strategy]
      [%edit-metadata slate-id=@t cid=cid priv=gossip-privacy name=@t]
  ==
:: +$  update
::   $%  :: TODO
::   ==
--
