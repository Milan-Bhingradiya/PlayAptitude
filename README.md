# PlayAptitude

**PlayAptitude** is a multiplayer 1-vs-1 game built using **Next.js**, **Node.js (Express)**, **TypeScript**, and **PostgreSQL**. The game challenges players' aptitude skills through timed multiple-choice questions (MCQs) while offering features to enhance gameplay and interactivity.

## Features

### 1. **Multiplayer Gameplay**
- **1-vs-1 Matches**: Play against another player in real-time.
- **Timed Questions**: Each MCQ has a 60-second timer.
  - Answer within 10 seconds to earn **50 points**.
  - The same scoring logic applies to both players.

### 2. **Time Management**
- **Time Freeze Requests**: Request to pause the timer for both players if you need more time to think.
  - Requests are sent in real-time using WebSockets.
  - The opponent must accept the request for the time to stop.

### 3. **Audio Support**
- After a certain time (e.g., 5 minutes), if both players are stuck, you can enable the microphone to discuss the problem and assist each other in understanding the solution.

### 4. **In-Game Chat**
- Send quick messages to your opponent during the game, such as:
  - "Yoo!"
  - "Yeah!"
  - "Loser!" (Keep it friendly!)

### 5. **Future Enhancements**
- Video calling functionality to enhance interaction.

## Tech Stack

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript

### Backend
- **Framework**: Node.js (Express)
- **Language**: TypeScript
- **Database**: PostgreSQL

### Real-Time Communication
- **WebSockets**: For live gameplay, time freeze requests, and in-game chat.

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Milan-Bhingradiya/PlayAptitude.git
   cd PlayAptitude
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database.
   - Update the database connection details in the environment configuration file.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Start the backend server:
   ```bash
   npm run start:server
   ```

6. Access the application in your browser:
   ```
   http://localhost:3000
   ```

## How to Play

1. **Join a Match**: Start a 1-vs-1 match against another player.
2. **Answer Questions**: Solve MCQs within the time limit to earn points.
3. **Request Time Freeze**: Pause the timer if needed by sending a request to your opponent.
4. **Chat and Collaborate**: Use chat or the mic to communicate with your opponent during the game.

## Contribution

Contributions are welcome! Feel free to submit issues or pull requests to improve the project.

### Steps to Contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push the changes:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

### Contact
For questions or feedback, feel free to reach out to [Milan Bhingradiya](https://www.linkedin.com/in/milanbhingradiya).

