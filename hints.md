:pantheon-agent &pantheon-action [%add-key 'SLAaa642f82-4ee6-4693-9eb7-6af34fc1d01fTE']
:pantheon-agent &pantheon-action [%sync-files %theirs]
=psur -build-file /=pantheon=/sur/pantheon/hoon

::  name ext public tag
.^(query.psur %gx /=pantheon-agent=/search/pi///pantheon-query)

.^(query.psur %gx /=pantheon-agent=/files/pantheon-query)
