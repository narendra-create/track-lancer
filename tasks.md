# tasks list

- [x] CONTROLLER: Create authentication middleware and protected routes for Freelancer and Client roles
- [x] CONTROLLER: Implement logic for Freelancer onboarding and profile creation
- [x] CONTROLLER: Implement logic for Client onboarding and profile creation
- [x] CONTROLLER: Add controller for creating new Projects and assigning them to Clients/Freelancers
- [x] CONTROLLER: Add logic for Freelancers to propose Projects
- [x] CONTROLLER: Implement Milestone creation, updates workflows
- [x] CONTROLLER: Handle Budget Raise Requests (creation, approval, rejection)
- [x] API/REALDATA: Fetch paginated list of projects for Freelancer dashboard
- [x] API/REALDATA: Fetch detailed view of a single project including milestones and payments
- [x] API/REALDATA: Fetch and calculate payment due dates and amounts
- [x] API/REALDATA: Create endpoints for budget raise request actions
- [x] UI: Design and implement the Freelancer dashboard overview page
- [x] UI: Design and implement the Client dashboard overview page
- [x] UI: Create the Project Details view (showing timeline, budget, and milestones)
- [x] UI: Build the component for adding milestones within a project
- [x] UI: Create the Budget Raise Request form modal or page
- [x] UI: Design the Payment history and status tracking table
- [x] WIREUP: Connect the Freelancer dashboard UI to the project fetching API
- [x] WIREUP: Integrate the Project Details view with live milestone and payment data
- [x] WIREUP: Connect Budget Raise Request actions to real API endpoints
- [x] ADDITIONAL: Add role-based access control (RBAC) checks on all sensitive API routes
- [x] UI: Create Past Projects component with reusable cards for completed projects
- [x] API/REALDATA: Fetch completed projects and map data to PastProjects component
- [x] WIREUP: Integrate PastProjects component into Freelancer
- [x] UI: Add pagination or "Load More" functionality to Past Projects list
- [x] UI: Implement filtering or sorting options for Past Projects (e.g., by date or cost)
- [x] VALIDATION: Make validation file for creating projects
- [x] make controller for deleting projects, only unverified projects
- [x] make a controller for stopping the project
- [x] make a page to see unverified projects for freelancer
- [x] connect create project feature with controller
- [x] Make milestones ui
- [x] make budget raise request ui
- [x] add extra buttons in settings page
- [x] make controllers for projectid based milestones
- [x] make one controller to return all projects

# for 02/07/2026

- [x] wire up: make a function to add milestones
- [x] make a function to delay the milestone
- [x] work on budget raise request
- [x] payment history ui

# for 05/07/2006

- [x] add checks on milestone creation like user cant create milestone if budget reached, and only not started status milestones after one in progress milestone
- [x] budget raise request ui
- [x] see budget requests page
- [x] create budget request controller
- [x] add handleDelay and milestone delete in milestones page of freelancer
- [x] connect budget request creation

# for 06/07/2026

- [x] make controller for budget approve
- [x] function to markReviewd in budgetcontroller
- [x] controller for rejecting the request
- [x] add those controllers in frontend
- [x] approve budget controller
- [x] delete request controller
- [x] make projectid based budget request returner function
- [x] make client pages
- [x] make milestone page for client
- [x] make client sidebar
- [x] make client settings page
- [x] make client all projects page
- [x] make approve project system for client
- [x] make searchProject controller

# for 07/07/2026

- [x] update font size and element sizes in client/all-projects and freelancer/see-projects
- [x] refresh page or animate when approve or reject clicked
- [x] budget requests page for client
- [x] project specific budget requests page
- [x] make past projects page for client
- [x] verify payments page ui
- [x] payment history cards and page
- [x] Milestone status complete controller
- [x] add limit on milestone cost for freelancer

# for 08/07/2026

- [x] assign navigation buttons to all newly created pages

# for 09/07/2026

- [x] verify payments controller
- [x] make client dashboard
- [x] payment history controllers
- [x] make profile update system
- [x] update settings page to update profile and more
- [x] fix - background of verify-payments page
- [x] continue paymentController
- [x] add real data in payment history page
- [x] add real data in verification requests page
- [x] add real data to client dashboard from existing controllers stage 1

# for 10/07/2026

- [x] Make Payment initiate for client with qr code
- [x] make i have paid page where they can submit txn number and screenshot
- [x] Make controller for marking project completed
- [x] make button for marking project completed for freelancer
- [x] Start working on activity page for both client and freelancer
- [x] make controllers for client dashboard stats and data
- [x] make upi code submit system for freelancer
- [x] update terms page
- [x] link payment details component with history cards

# for 11/07/2026

- [x] make setnew password controller for settings page
- [x] make project cancelled button
- [x] make getdeadlinecontroller for client dashboard
- [x] continue on client dashboard real data
- [x] make controller for get client money stats, upcoming deadlines, client dashboard stats
- [x] Add real data to client dashboard stage 2
- [x] make cancel request model
- [x] make cancel request generation
- [x] make cancel request approval and reject

# for 12/07/2026

- [x] make a function to archive projects from freelancer or from client side
- [x] make a archived projects page
- [x] make function to unarchive projects
- [x] update project findings by is archived or not on all pages
- [x] API/REALDATA: Fetch paginated list of projects for Client dashboard
- [x] create model for activity feature
- [x] replace earned with paid in client milestones page
- [x] make sure only one request of cancellation generates for each project
- [x] fix a bug - when rejecting the cancel request and then generating new request - instently cancells the project
- [x] fix a bug - when client stops the project - the project is still active and freelancer can create any new data

# for 13/07/2026

- [x] make resume project button
- [x] make resume project controller for client

# for 14/07/2026

- [x] show payment for cancelled projects too - give freelancer the money back
- [x] cancelled projects on past project page
- [x] continue activity feature
- [x] implement sms making in controllers
  - milestone Delay controller function
  - whole Milestone controller
  - Payment controller
  - reminder
- [x] Add activity creation logic in project controller and budget controller too
- [x] see all date selectors to only select future dates and within the project deadline limit
- [x] bug - freelancer revenue showing 0
- [x] make delay controller update project deadline and next milestone deadline too

# for 15/07/2026

- [x] Make controller for getting activitys
- [ ] add activitys in frontend of both client and freelancer
- [ ] integrate polling for real time notifications
- [ ] cron job for deleting messages more then 7 days
- [ ] make notification off system for settings page

## additionals

- [ ] ADDITIONAL: Set up email notifications or in-app alerts for milestone status changes
- [ ] ADDITIONAL: Implement automated reminders for pending payments
