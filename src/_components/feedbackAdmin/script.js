/**
 * Decodes HTML entities in a string and sanitizes it to prevent XSS.
 * @param {string} str - The string to decode and sanitize.
 * @returns {string} The decoded and sanitized string.
 */
function decodeHtmlEntities(str) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = str;
  const decodedString = textArea.value;

  // Sanitize the decoded string to prevent XSS
  const sanitizedString = decodedString.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );
  return sanitizedString;
}

/**
 * Fetches feedback data from the local middleware
 * (which fetches it from the server) and displays it in a table.
 * @param {string} containerId - The ID of the div where the table will be inserted.
 */
async function loadFeedbackTable(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  container.innerHTML = "";

  try {
    const response = await fetch("/api/feedback?basename=*");
    if (!response.ok) {
      throw new Error(`${response.statusText} ${response.status}`);
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

    ["Date", "URL", "Vote", "Comment", "Actions"].forEach((headerText) => {
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
      let feedbackData;

      if (typeof feedback.value === "string") {
        feedbackData = JSON.parse(feedback.value);
      } else {
        feedbackData = feedback.value;
      }
      // Extract the timestamp from the feedbackData
      const date = new Date(feedbackData.timestamp);

      dateCell.textContent = date.toLocaleString();
      row.appendChild(dateCell);

      const urlCell = document.createElement("td");
      const urlLink = document.createElement("a");
      urlLink.href = `${feedbackData.basename}`;
      urlLink.textContent = feedbackData.basename;
      urlCell.appendChild(urlLink);
      row.appendChild(urlCell);

      const voteCell = document.createElement("td");
      voteCell.textContent = feedbackData.vote;
      row.appendChild(voteCell);

      const commentCell = document.createElement("td");
      commentCell.textContent = feedbackData.comment
        ? decodeHtmlEntities(feedbackData.comment)
        : "N/A";
      row.appendChild(commentCell);

      const actionsCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("admin-button-danger");
      deleteButton.textContent = "Delete";
      deleteButton.href = "#";

      const fullKey = feedback.key;
      deleteButton.dataset.key = JSON.stringify(fullKey);

      deleteButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const button = event.target;
        const keyString = button.dataset.key;
        const key = JSON.parse(keyString);

        try {
          const response = await fetch("/api/feedback", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ key }),
          });

          if (response.ok) {
            const row = button.closest("tr");
            row.remove();
          } else {
            // should show an alert here (TODO)
            const errorData = await response.json();
            console.error("Error deleting feedback:", errorData);
            alert(`Error deleting feedback: ${JSON.stringify(errorData)}`);
          }
        } catch (error) {
          console.error("Error deleting feedback:", error);
          alert(`Error deleting feedback: ${error.message}`);
        }
      });
      actionsCell.appendChild(deleteButton);
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

/**
 * Fetches and displays a report (SEO or broken links) in a table.
 * @param {string} containerId - The ID of the container to insert the table.
 * @param {string} apiEndpoint - The API endpoint to fetch the report data.
 */
async function loadReportTable(containerId, apiEndpoint) {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  container.innerHTML = "";

  try {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(`${response.statusText} ${response.status}`);
    }
    const reportData = await response.json();

    if (Object.keys(reportData).length === 0) {
      container.innerHTML = "<p><strong>No report to share! 🎉</strong></p>";
      return;
    }

    const table = document.createElement("table");
    table.classList.add("report-table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const headers = ["URL Or Broken URL", "Issues Or Affected Pages"];
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (const url in reportData) {
      const row = document.createElement("tr");

      const urlCell = document.createElement("td");
      const urlLink = document.createElement("a");
      urlLink.href = url;
      urlLink.textContent = url;
      urlCell.appendChild(urlLink);
      row.appendChild(urlCell);

      const issuesCell = document.createElement("td");
      const issuesList = document.createElement("ul");
      reportData[url].forEach((issue) => {
        const listItem = document.createElement("li");
        listItem.classList.add("margin-top--sm", "margin-right--sm");
        listItem.textContent = issue;
        issuesList.appendChild(listItem);
      });
      issuesCell.appendChild(issuesList);
      row.appendChild(issuesCell);

      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    container.appendChild(table);
  } catch (_error) {
    container.innerHTML = "<p><strong>No report to share! 🎉</strong></p>";
  }
}

// says what it does, does what it says.
function refreshFeedbackTable(containerId) {
  loadFeedbackTable(containerId);
}

// says what it does, does what it says.
function refreshReportTable(containerId, apiEndpoint) {
  loadReportTable(containerId, apiEndpoint);
}

document.addEventListener("DOMContentLoaded", () => {
  const feedbackContainerId = "feedback-table-container";
  const seoReportContainerId = "seo-report-table-container";
  const brokenLinksReportContainerId = "broken-link-report-table-container";

  const feedbackContainer = document.getElementById(feedbackContainerId);
  const seoReportContainer = document.getElementById(seoReportContainerId);
  const brokenLinksReportContainer = document.getElementById(
    brokenLinksReportContainerId,
  );

  if (feedbackContainer) {
    loadFeedbackTable(feedbackContainerId);
    const refreshFeedbackButton = document.createElement("button");
    refreshFeedbackButton.textContent = "Refresh Feedback";
    refreshFeedbackButton.classList.add("admin-button");
    refreshFeedbackButton.addEventListener(
      "click",
      () => refreshFeedbackTable(feedbackContainerId),
    );
    feedbackContainer.parentNode.insertBefore(
      refreshFeedbackButton,
      feedbackContainer,
    );
  }

  if (seoReportContainer) {
    loadReportTable(seoReportContainerId, "/api/seo-report");
    const refreshSeoReportButton = document.createElement("button");
    refreshSeoReportButton.textContent = "Refresh SEO Report";
    refreshSeoReportButton.classList.add("admin-button");
    refreshSeoReportButton.addEventListener(
      "click",
      () => refreshReportTable(seoReportContainerId, "/api/seo-report"),
    );
    seoReportContainer.parentNode.insertBefore(
      refreshSeoReportButton,
      seoReportContainer,
    );
  }

  if (brokenLinksReportContainer) {
    loadReportTable(brokenLinksReportContainerId, "/api/broken-links-report");
    const refreshBrokenLinksReportButton = document.createElement("button");
    refreshBrokenLinksReportButton.textContent = "Refresh Broken Links Report";
    refreshBrokenLinksReportButton.classList.add("admin-button");
    refreshBrokenLinksReportButton.addEventListener(
      "click",
      () =>
        refreshReportTable(
          brokenLinksReportContainerId,
          "/api/broken-links-report",
        ),
    );
    brokenLinksReportContainer.parentNode.insertBefore(
      refreshBrokenLinksReportButton,
      brokenLinksReportContainer,
    );
  }
});
