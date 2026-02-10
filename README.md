# Yarncom: A Full-Stack Community Blogging Platform 🧶 💻📱
**Yarncom**  is a community-driven blogging platform designed to craft individual threads of thought into a larger narrative. 

Built with a focus on security, scalability, and a seamless user experience, this application serves as a complete solution for modern blogging.

This project is part of my **Progressive Backend Journey**, where I document the evolution of building production-grade full-stack systems from scratch.

# 🚀 Key Features
* **Dynamic UI Rendering**: Powered by EJS, providing a fast and responsive interface for both readers and authors.


* **Secure Authentication**: User signup and sign-in powered by JWT (JSON Web Tokens) with secure session management.


* **State-Driven Content**: Intelligent content lifecycle (Draft vs. Published states) ensuring only polished "Yarns" reach the public feed.
* **Automated Metadata**: A custom algorithm that calculates estimated reading time based on word count before an article is persisted.

* **Advanced Discovery**:
    - Pagination: Efficient data fetching limited to 20 articles per page.

    - Search & Filter: Find content by author, title, or tags.
    - Sorting: Order the community feed by read count, timestamp, or reading time.
* **Ownership Protection**: Robust authorization logic ensuring only the original author can edit or delete their content.

# 🛠️ Tech Stack
**Backend**: Node.js & Express.js

**Frontend**: EJS (Embedded JavaScript Templates) & Tailwind CSS

**Database**: MongoDB Atlas (NoSQL)

**ODM**: Mongoose

**Security**: Bcrypt (Password Hashing) & JWT



# 📂 Architecture (MVC)
This project follows the **MVC (Model-View-Controller)** pattern to ensure a clean separation of concerns:

* **Models**: Define the data structure for Users and Blogs.

* **Views**: EJS templates that render the user interface dynamically.

* **Controllers**: Handle the business logic and coordinate between Models and Views.
* **Middleware**: Manage authentication guards and request logging.


# ⚙️ Installation & Setup
1. Clone the Repository:
    
    `git clone [https://github.com/dillibs001/yarncom-api.git](https://github.com/dillibs001/yarncom-api.git)`

    `cd yarncom-api`


2. Install Dependencies:
`npm install`


3. Environment Configuration:
Create a `.env` file in the root directory and add:

    `PORT=3000`

    `MONGO_URI=your_mongodb_connection_string`

    `JWT_SECRET=your_secret_key`


4. Start the Server:
 `npm run start`


# 📖 The Journey

I am documenting the development of **Yarncom** as a series of technical deep-dives. You can follow the progress here:
* Phase 1: Authentication & Security  [Link Coming Soon]
* Phase 2: Data Modeling & Reading Time Algorithms  [Link Coming Soon]
* Phase 3: Building the UI with EJS & Tailwind [Link Coming Soon]
* Phase 4: Search, Pagination & Production Deployment [Link Coming Soon]

# 🔗 Submission Details

* **GitHub Repository**: https://github.com/dillibs001/yarncom-api

* **Live Demo**: [Deployment in Progress]

Built with ❤️ as part of a progressive learning journey in Backend Engineering




