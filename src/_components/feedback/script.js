document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("page-feedback");
  if (!container) {
    // nothing to do
    return;
  }

  const basename = container.dataset.basename;
  if (!basename) {
    return console.error(
      "comp.feedback: missing \"data-basename\" attribute in page-feedback element.",
    );
  }

  const voteKey = `feedback-${basename}`;
  const previousVote = localStorage.getItem(voteKey);
  if (previousVote) {
    // already voted
    // TODO - compare vote date against last update date and remove if stale?
    return;
  }

  const form = document.getElementById("page-feedback-form");
  const voteButtons = document.querySelectorAll(".page-feedback-vote");
  const header = document.getElementById("page-feedback-header");
  const comment = document.getElementById("page-feedback-comment");
  const clear = document.getElementById("page-feedback-clear");
  const submit = document.getElementById("page-feedback-submit");
  const charCountDisplay = document.getElementById("page-feedback-characters");
  const alert = document.getElementById("page-feedback-alert");

  const currentVoteClass = "pills__item--active";
  const submitDisabledClass = "button--secondary";
  const submitEnabledClass = "button--primary";
  const MAX_CHARS = 650;

  let selectedButton = null;
  container.style.display = "inline-block";

  async function submitFeedback(feedbackData) {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // just re-throw for now, but some kind of error reporting would be ideal.
      // if this is broken, so is their ability to tell you it's broken.
      throw error;
    }
  }

  function updateCharCount() {
    const remainingChars = MAX_CHARS - comment.value.length;
    charCountDisplay.textContent = `${remainingChars}`;

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

  clear.addEventListener("click", function(event) {
    event.preventDefault();
    comment.value = "";
    voteButtons.forEach((button) => {
      button.classList.remove(currentVoteClass);
    });
    submit.disabled = true;
    submit.classList.remove(submitEnabledClass);
    submit.classList.add(submitDisabledClass);
    selectedButton = null;
    updateCharCount();
  });

  submit.addEventListener("click", function(event) {
    event.preventDefault();
    const verify = document.getElementById("page-feedback-verify");
    const feedbackData = new Object();
    feedbackData.comment = comment.value;
    feedbackData.vote = parseInt(selectedButton.dataset.vote);
    feedbackData.timestamp = new Date();
    feedbackData.basename = basename;
    feedbackData.verify = verify.value;

    try {
      const _response = submitFeedback(feedbackData);
    } catch (error) {
      alert.classList.remove("alert--success");
      alert.classList.add("alert--danger");
      alert.textContent = error.message;
      container.style.display = "none";
      alert.style.display = "block";
      return console.error("Error submitting feedback:", error.message);
    }

    localStorage.setItem(voteKey, new Date());
    container.style.display = "none";
    alert.style.display = "block";
  });

  voteButtons.forEach((button) => {
    button.addEventListener("click", function(event) {
      event.preventDefault();
      const _vote = parseInt(button.dataset.vote);
      form.style.display = "block";
      header.style.display = "none";

      if (selectedButton) {
        selectedButton.classList.remove(currentVoteClass);
      }

      button.classList.add(currentVoteClass);
      selectedButton = button; // Assign the clicked button

      submit.disabled = false;
      submit.classList.remove(submitDisabledClass);
      submit.classList.add(submitEnabledClass);

      comment.focus();
      updateCharCount();
    });
  });
});
