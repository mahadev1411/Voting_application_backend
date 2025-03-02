Voting System
Tech Stack: Node.js, Express.js, MongoDB, JWT

Features:
User Registration & Authentication: Secure signup and login using JWT-based authentication.

Vote Casting: Users can cast votes for candidates securely, ensuring one vote per user.

Results Viewing: Real-time vote counting and results retrieval.

Role-Based Access: Admins can manage candidates and view complete vote statistics.

Database Storage: Votes and user data are stored in MongoDB with proper validation.

Email confirmations are sent using node-mailer package during the signup and casting of vote.

Rate Limiting feature makes sure that too many requests are not sent to the server within the set amount of time which prevents DOS attacks.

"Refer to **plan.txt** file for the entire overview of the project and endpoints defined for each role"
