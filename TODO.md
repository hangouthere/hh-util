# TODO

## General

* Rename scripts to indicate docker runtime
* Create new scripts to shorten for `node_modules/.bin` scripts to exec consistently in other projects using this lib
* Rename nfg->hangouthere
* Get linting fully configured


## Plugins
* Clean up language between Accessor and Behavior
 Names
  * AccessorName is the *requested* name for a Behavior
  * BehaviorName is the *provided* name for a Behavior
  * They differ because an AccessorName *might* not exist and that could be catastrophic, or the plugin could gracefully handle it (ie, optional support to/via other plugins). But it's guaranteed a BehaviorName to exist, because they are retrieved from all Plugins on "scan" and announce their ability to *provide*.
  *
* Fix up docs
  * Pull over old guide stuff?
  * FQN in current README is defined late, move the definition earlier!
