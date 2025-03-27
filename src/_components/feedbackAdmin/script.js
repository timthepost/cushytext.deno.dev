/**
 * Fetches feedback data from the local middleware
 * (which fetches it from the server) and displays it in a table.
 * @param {string} containerId - The ID of the div where the table will be inserted.
 */
async function loadFeedbackTable(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID "${containerId}" not found.`);
    return;
  }

  container.innerHTML = "";

  try {
    const response = await fetch("/api/feedback?basename=*");
    if (!response.ok) {
      throw new Error(`${response.error} ${response.status}`);
    }
    const feedbackList = await response.json();

    if (feedbackList.length === 0) {
      container.innerHTML = "<p>No feedback found.</p>";
      return;
    }

    const table = document.createElement("table");
    table.classList.add("feedback-table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Date", "URL", "Comment", "Actions"].forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    feedbackList.forEach((feedback) => {
      const row = document.createElement("tr");

      const dateCell = document.createElement("td");
      let date;
      let message;
      if (typeof feedback.value === "string") {
        const parsedFeedback = JSON.parse(feedback.value);
        date = new Date(parsedFeedback.timestamp);
        message = parsedFeedback.message;
      } else {
        date = new Date(feedback.value.timestamp);
        message = feedback.value.comment;
      }
      dateCell.textContent = date.toLocaleString();
      row.appendChild(dateCell);

      const urlCell = document.createElement("td");
      const urlLink = document.createElement("a");
      urlLink.href = `${feedback.key[1]}`;
      urlLink.textContent = feedback.key[1];
      urlCell.appendChild(urlLink);
      row.appendChild(urlCell);

      const commentCell = document.createElement("td");
      commentCell.textContent = message;
      row.appendChild(commentCell);

      const actionsCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("button", "button--warning");
      deleteButton.textContent = "Delete";
      deleteButton.href = "#";
      actionsCell.appendChild(deleteButton);

      const spamButton = document.createElement("button");
      spamButton.classList.add("button", "button--danger", "margin-left--sm");
      spamButton.textContent = "Spam";
      spamButton.href = "#";
      actionsCell.appendChild(spamButton);

      row.appendChild(actionsCell);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    container.appendChild(table);
  } catch (error) {
    console.error("Error fetching or displaying feedback:", error);
    container.innerHTML = `<p>Error loading feedback: <em>${error.message}</em></p>`;
  }
}

function refreshFeedbackTable(containerId) {
  loadFeedbackTable(containerId);
}

document.addEventListener("DOMContentLoaded", () => {
  const containerId = "feedback-table-container";
  loadFeedbackTable(containerId);

  const refreshButton = document.createElement("button");
  refreshButton.textContent = "Refresh";
  refreshButton.classList.add("button");
  refreshButton.classList.add("button--success");
  refreshButton.classList.add("margin-bottom--md");
  refreshButton.addEventListener(
    "click",
    () => refreshFeedbackTable(containerId),
  );

  const container = document.getElementById(containerId);
  if (container) {
    container.parentNode.insertBefore(refreshButton, container);
  }
});
