//const for enter key
const ENTER=13

//handle when the enter key is pressed
function handleKeyUp(event) {
    event.preventDefault()
       if (event.keyCode === ENTER) {
          document.getElementById("submit_button").click()
      }
    }
  document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('submit_button').addEventListener('click', getSong)
  //add key handler for the document as a whole, not separate elements.
  document.addEventListener('keyup', handleKeyUp)
})