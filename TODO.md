# TODO

## General

* Revisit linting (not sure what's missing)
* Docker Compose scripts need documenting in README to let devs know how to use them in parenting projects
* Create `Dockerfile` to add:
    * git
        * Will fix publishing error since `git` is missing:
        > This is a Git checkout, but the git command was not found. npm could not create a Git tag for this release!


## Plugins
* Clean up language between Accessor and Behavior
 Names
  * AccessorName is the *requested* name for a Behavior
  * BehaviorName is the *provided* name for a Behavior
  * They differ because an AccessorName *might* not exist and that could be catastrophic, or the plugin could gracefully handle it (ie, optional support to/via other plugins). But it's guaranteed a BehaviorName to exist, because they are retrieved from all Plugins on "scan" and announce their ability to *provide*.
* Fix up docs
  * Pull over old guide stuff?
  * FQN in current README is defined late, move the definition earlier!
