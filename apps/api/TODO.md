# Changes
## Common
- Seperate the validation parsing logic
## Module: Restaurant
- Get all the leads based on restaurant
- ## Module: Lead
- The logic of reassign-manager should be changed, the request to reassign should be send via frontend and it should be show as a reassign request to the admin or the new desired manager, then the reassignment should be accepted or rejected
- Make a middleaware to check weather the lead is owned by the user or not, and attach the lead to request body, it will be better for avoiding repetitions
- POCs should be tied loosly to lead, even if lead is deleted, POCs should remain and belong to restaurant. This way they can be shared among many lead
- Think about where createContact should be present later
## Bugs