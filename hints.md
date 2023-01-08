# Pokes
::  Please do not steal my key :P
```
:pantheon-agent &pantheon-action [%add-key 'your-key']
:pantheon-agent &pantheon-action [%sync-files %theirs]

:: edit-metadata tag-id cid new-privacy new-name
:pantheon-agent &pantheon-action [%edit-metadata '5dcd6644-9116-4a5e-984d-5196dadc9a2a' 'bafybeig4gw4vis6jcqnc7u6xvmaym53i6zapmelkl46bx3sg5l7oqwe7xy' %private 'stun']
```

# Scries 
```
=psur -build-file /=pantheon=/sur/pantheon/hoon
:: search name ext privacy owner

.^(query.psur %gx /=pantheon-agent=/search/pi/$/$/(scot %p our)/pantheon-query)
.^(query.psur %gx /=pantheon-agent=/search/pi/$/$/$/pantheon-query)
.^(query.psur %gx /=pantheon-agent=/files/pantheon-query)

```
