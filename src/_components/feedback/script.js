document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("page-feedback-form");
  if (!form) {
    return;
  }
  const voteButtons = document.querySelectorAll(".page-feedback-vote");
  const header = document.getElementById("page-feedback-header");
  const label = document.getElementById("page-feedback-label");
  const comment = document.getElementById("page-feedback-comment");
  const clear = document.getElementById("page-feedback-clear");
  const submit = document.getElementById("page-feedback-submit");
  const charCountDisplay = document.getElementById("page-feedback-characters");

  const currentVoteClass = "button--primary";
  const otherVoteClass = "button--secondary";
  const submitDisabledClass = "button--secondary";
  const submitEnabledClass = "button--success";
  const MAX_CHARS = 650;

  let selectedButton = null;

  function updateCharCount() {
    const remainingChars = MAX_CHARS - comment.value.length;
    charCountDisplay.textContent = `Characters Remaining: ${remainingChars}`;

    if (remainingChars < 0) {
      submit.disabled = true;
      submit.classList.remove(submitEnabledClass);
      submit.classList.add(submitDisabledClass);
    } else {
      if (selectedButton) {
        submit.disabled = false;
        submit.classList.remove(submitDisabledClass);
        submit.classList.add(submitEnabledClass);
      } else {
        submit.disabled = true;
        submit.classList.remove(submitEnabledClass);
        submit.classList.add(submitDisabledClass);
      }
    }
  }

  updateCharCount();
  comment.addEventListener("input", updateCharCount);

  clear.addEventListener("click", function (event) {
    event.preventDefault();
    comment.value = "";
    label.textContent = "Was reading this article a good use of your time?";
    voteButtons.forEach((button) => {
      button.classList.remove(currentVoteClass);
      button.classList.add(otherVoteClass);
    });
    submit.disabled = true;
    submit.classList.remove(submitEnabledClass);
    submit.classList.add(submitDisabledClass);
    selectedButton = null;
    updateCharCount();
  });

  submit.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Soon. Not yet.");
  });

  voteButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const vote = parseInt(button.dataset.vote);
      form.style.display = "block";
      header.style.display = "none";

      if (selectedButton) {
        selectedButton.classList.remove(currentVoteClass);
        selectedButton.classList.add(otherVoteClass);
      }

      button.classList.remove(otherVoteClass);
      button.classList.add(currentVoteClass);
      selectedButton = button; // Assign the clicked button

      submit.disabled = false;
      submit.classList.remove(submitDisabledClass);
      submit.classList.add(submitEnabledClass);

      switch (vote) {
        case 0:
        case -1:
          label.textContent = "Sorry! What could be better about this page?";
          break;
        case 1:
          label.textContent = "Great! What could make this page even better?";
          break;
        default:
          break;
      }
      comment.focus();
      updateCharCount();
    });
  });
});
