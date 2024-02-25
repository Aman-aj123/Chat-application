function main() {
     const socket = io('http://127.0.0.1:8000');

     
     const sendButton = document.querySelector("#submitButton");
     const messageForm = document.querySelector(".message-form");
     const messageInput = document.querySelector(".message-input");
     const messageArea = document.querySelector(".messages-area");

     const messageAudio = new Audio("/musics/message.wav");

     const name = prompt("Enter your name to join the chat..");
     socket.emit("new-user-joined", name);

     const append = (message, position, messageClass, userName) => {
          if (name !== "" && name !== null) {
               const messageElement = document.createElement('div');
               messageElement.innerHTML = `
     <div class="message-items ${messageClass} ${position}"><span class="msg-sender">${userName}</span>${message}</div>
     `;
               messageElement.classList.add("message-wrapper");
               messageArea.appendChild(messageElement);
          } else {
               return;
          }

     };


     

     // submitting form when the user clicks on the send icon button
     // preventing default if the form submit
     messageForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const messageValue = messageInput.value.trim(); // Trim to remove leading and trailing whitespaces
          if (messageValue !== "") {
               append(`${messageValue}`, "right", "", "You:");
               socket.emit('send', messageValue);
               messageInput.value = "";
          }
     });


     // if the user click on send button then send the message
     sendButton.addEventListener("click", () => {
          messageForm.dispatchEvent(new Event("submit"));
     });





     //--------> MAIN LOGIC 


     // If any user join the chat then send the message to another user
     socket.on("user-joined", (name) => {
          if (name !== "" && name !== null) {
               append(`${name} joined the chat`, 'right', "chat-joined", "");
               messageAudio.play();
          }
     });



     // Receiving the message
     socket.on("receive", (data) => {
          if (name !== "" && name !== null) {
               append(`${data.message}`, 'left', "", `${data.name}`,);
               messageAudio.play();
          }
     });



     // sending a message if the user disconnect
     socket.on('left', (name) => {
          if (name !== null) {
               append(`${name} left the chat`, 'left', "disconnect", ``);
               messageAudio.play();
          }
     });

}



// calling the main function
document.addEventListener("DOMContentLoaded", ()=>{
main();
})