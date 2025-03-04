// List of random Linux-related terms for the typing test
const linuxCommands = [
    "grep", "root", "ssh", "bash", "tail", "file.txt", "cd /home", "sudo apt update", "ls -l", 
    "chmod 755", "ps aux", "df -h", "mkdir new_folder", "rm -rf", "cat /etc/passwd", "cp file1 file2", 
    "mv file1.txt /tmp", "echo 'hello world'", "nano config.cfg", "man ls", "wget http://example.com", 
    "top", "exit", "find / -name '*.txt'", "docker ps", "tar -czf backup.tar.gz", "uptime", "journalctl", 
    "lsblk", "ifconfig", "ip a", "service apache2 restart", "systemctl status", "mount /dev/sda1", "unzip file.zip"
];

let startTime;
let timerInterval;
let timeLeft = 100;
let typingInProgress = false;
let testFinished = false;  // Flag to check if the test is finished
let currentCommand = "";
let wordsTyped = 0;
let correctChars = 0;
let userInput = "";

// Shuffle the commands and pick one to display first
function shuffleCommands() {
    let shuffledCommands = linuxCommands.slice();  // Copy the original commands
    for (let i = shuffledCommands.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCommands[i], shuffledCommands[j]] = [shuffledCommands[j], shuffledCommands[i]]; // Swap elements
    }
    return shuffledCommands;
}

let randomCommands = shuffleCommands();  // Shuffle commands when page loads

// Set the first command as the prompt
function setNewCommand() {
    currentCommand = randomCommands[0];  // First command stays constant
    document.getElementById("command").textContent = "Type this command: " + currentCommand;  // Display prompt
    userInput = "";  // Reset user input
    document.getElementById("user-input-placeholder").textContent = ""; // Reset display
    document.getElementById("user-input-placeholder").focus();
}

// Start the typing test automatically
function startTest() {
    typingInProgress = true;
    testFinished = false;  // Reset test finished flag
    setNewCommand();  // Set the first command as prompt immediately when test starts
    startTimer();  // Start the timer
}

// Start the timer for the test
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("time-left").textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            typingInProgress = false;
            testFinished = true;
            stopTest();
        }
    }, 1000);
}

// Handle user input and spacebar behavior
document.addEventListener("keydown", function(event) {
    // If test is finished, prevent any input
    if (testFinished) {
        return; // Exit early if test is finished
    }

    const keyPressed = event.key;

    // Start the test when typing starts (check if the user starts typing after the initial prompt)
    if (!typingInProgress && userInput === "") {
        startTest();
    }

    // If Tab key is pressed, reload the page to restart the test
    if (keyPressed === "Tab") {
        location.reload();  // Refresh the page to restart the test
        event.preventDefault();  // Prevent the default tab behavior
        return;  // Exit the event handler
    }

    // Spacebar enters a space (normal behavior)
    if (keyPressed === " ") {
        userInput += " ";
        document.getElementById("user-input-placeholder").textContent = userInput;
        event.preventDefault();  // Allow space, but prevent form submission
    } 
    // Allow backspace to delete characters
    else if (keyPressed === "Backspace") {
        userInput = userInput.slice(0, -1);
        document.getElementById("user-input-placeholder").textContent = userInput;
    }
    // Allow typing of normal characters
    else if (keyPressed.length === 1) {
        userInput += keyPressed;
        document.getElementById("user-input-placeholder").textContent = userInput;
    }

    // Calculate accuracy
    calculateAccuracy();

    // Enter key moves to the next prompt (regardless of whether the command is typed correctly)
    if (keyPressed === "Enter") {
        randomCommands.shift(); // Remove the first command from the list after pressing Enter
        setNewCommand();  // Set the next random command
        event.preventDefault();  // Prevent default Enter action (e.g., form submission)
    }
});

// Function to calculate typing accuracy
function calculateAccuracy() {
    correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === currentCommand[i]) {
            correctChars++;
        }
    }
}

// Stop the test and calculate the final results
function stopTest() {
    const timeTaken = 100;
    const accuracy = ((correctChars / (wordsTyped * currentCommand.length)) * 100).toFixed(2);
    const speed = Math.round(wordsTyped / (timeTaken / 60));

    document.getElementById("accuracy").textContent = accuracy + "%";
    document.getElementById("speed").textContent = speed + " words per minute";
    document.getElementById("time-left").textContent = "0";

    // Show prompt to restart test
    document.getElementById("restart-button").style.display = "block"; // Show restart button
}

// Add event listener for the restart button
document.getElementById("restart-button").addEventListener("click", function() {
    location.reload();  // Reload the page to start a new test
});

// Automatically set the first command when the page loads
window.onload = function() {
    setNewCommand(); // Automatically set the first command when the page loads
}
