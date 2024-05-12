// chatService.js
const UserModel = require('../modals/userModel');

// Function to update the user's online status
async function updateUserStatus(userId, status) {
  await UserModel.updateOne({ _id: userId }, { status });
}

// Function to send a message to the recipient
async function sendMessageToRecipient(sender, recipient, message) {
  // Check recipient's status
  const recipientStatus = await getUserStatus(recipient);

  if (recipientStatus === 'AVAILABLE') {
    // Forward the message to the recipient
    await sendMessageDirectly(sender, recipient, message);
  } else if (recipientStatus === 'BUSY') {
    // Generate a response using the language model API
    const generatedResponse = await generateResponseUsingLLM(message);
    await sendMessageDirectly(recipient, sender, generatedResponse);
  } else {
    // Handle other cases, such as user not found
    throw new Error('Recipient not found or in an invalid status');
  }
}

// Function to get the user's online status
async function getUserStatus(userId) {
  const user = await UserModel.findById(userId);
  return user.status;
}

// Function to send a message directly to the recipient
async function sendMessageDirectly(sender, recipient, message) {
  // Implement the logic to directly send the message
  // This might involve updating the chat history, notifying the recipient, etc.
  console.log(`Sending message from ${sender} to ${recipient}: ${message}`);
}

// Function to generate a response using the language model API
async function generateResponseUsingLLM(message) {
  try {
    // Make an API call to the language model
    const response = await fetch('https://api.example.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      // Handle API errors
      throw new Error('Failed to generate response using language model');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error using language model API:', error);

    // Fallback to the mock function
    return generateResponseMock(message);
  }
}

// Mock function to generate a default response


module.exports = {
  updateUserStatus,
  sendMessageToRecipient,
  getUserStatus,
};
