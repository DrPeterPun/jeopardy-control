# Jeopardy controller

## Summary

This project is a webserver designed to mimic the tipical game show button behaviour of games like jeopardy.

## How it works

The platforms is split into two parts:

### Administrator

- defines when the button becomes clickable
- can see the order in which each contestant uses the button


### Contestant

- can chose an unused name and sign in
- can click a button to send the "i clicked the button cue"
- gets locked out if they click the button too early
- receives visible feedback if they are the first to click the button
