jquery
======

Just some useful jQuery plugins.

cursor_position :
  Helper functions to get and set the cursor (carret) position, as well as a stripOut function. Dependency for numeric_field and masked_field.

numeric_field :
  Adds a method to make an input text only accept numbers.
  Can be configured to accept natural, integer, rational numbers, within an interval.
  Lightning fast and works with Ctrl+V, right click > Paste, etc.

master_checkbox :
  Adds a method to set a checkbox the 'master' of a set of others with the same class.
  When the master is checked, all others are checked. When it is unchecked, all others are unchecked.
  When all the others are checked, the master is checked. When one of the others is unchecked, the master is unchecked.

masked_field : 
  Fork of Igor Escobar's jQuery-Mask-Plugin. Added a few more funcionalities, see file for changes.
