feather.replace();

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const USER_ID = currentUser?.id;

// const BASE_URL = "https://elegancewear-backend.onrender.com";
// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'http://192.168.49.2:30001';

const ALL_PURPOSES = [
  'email_tracking',
  'location_data',
  'device_info',
  'targeted_ads',
  'product_suggestions',
  'service_improvements',
  'email_updates'
];

let usageChart;

async function initializeChart() {
  try {
    if (usageChart) {
      usageChart.destroy();
      usageChart = null;
    }

    const res = await fetch(`${BASE_URL}/logs/${USER_ID}`);
    if (res.ok) {
      const logs = await res.json();

      const logCounts = processLogsForYearlyChart(logs);

      const ctx = document.getElementById('usageChart').getContext('2d');
      usageChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: logCounts.labels,
          datasets: [{
            label: 'Data Events',
            data: logCounts.data,
            backgroundColor: 'rgba(162, 76, 173, 0.1)',
            borderColor: '#a24cad',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#a24cad',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              align: 'start',
              labels: {
                usePointStyle: true,
                padding: 8,
                boxWidth: 8,
                boxHeight: 8,
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              },
              grid: {
                color: 'rgba(162, 76, 173, 0.1)'
              }
            },
            x: {
              grid: {
                color: 'rgba(162, 76, 173, 0.1)'
              }
            }
          },
          elements: {
            line: {
              tension: 0.4
            }
          }
        }
      });
    }
  } catch (err) {
    console.error("Error initializing chart:", err);
    initializeFallbackChart();
  }
}

function processLogsForYearlyChart(logs) {
  const monthlyCounts = new Map();

  logs.forEach(log => {
    const date = new Date(log.timestamp);
    const monthKey = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });

    monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) || 0) + 1);
  });

  const today = new Date();
  const labels = [];
  const data = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });

    labels.push(monthKey);
    data.push(monthlyCounts.get(monthKey) || 0);
  }

  return { labels, data };
}

function initializeFallbackChart() {
  if (usageChart) {
    usageChart.destroy();
    usageChart = null;
  }

  const ctx = document.getElementById('usageChart').getContext('2d');
  usageChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['June 24', 'June 25', 'June 26', 'June 27', 'June 28'],
      datasets: [{
        label: 'Data Events',
        data: [3, 5, 4, 6, 8],
        backgroundColor: 'rgba(162, 76, 173, 0.1)',
        borderColor: '#a24cad',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#a24cad',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(162, 76, 173, 0.1)'
          }
        },
        x: {
          grid: {
            color: 'rgba(162, 76, 173, 0.1)'
          }
        }
      }
    }
  });
}

async function updateChart() {
  if (usageChart) {
    try {
      const res = await fetch(`${BASE_URL}/logs/${USER_ID}`);
      if (res.ok) {
        const logs = await res.json();
        const logCounts = processLogsForYearlyChart(logs);

        usageChart.data.labels = logCounts.labels;
        usageChart.data.datasets[0].data = logCounts.data;
        usageChart.update();
      }
    } catch (err) {
      console.error("Error updating chart:", err);
    }
  }
}

async function fetchConsents() {
  try {
    const res = await fetch(`${BASE_URL}/consents/${USER_ID}`);

    if (res.ok) {
      const data = await res.json();
      const userConsents = data.consents || [];

      ALL_PURPOSES.forEach(purpose => {
        const toggle = document.querySelector(`[data-purpose="${purpose}"]`);
        if (toggle) {
          const existing = userConsents.find(c => c.purpose === purpose);
          toggle.checked = existing ? existing.granted : false;
        }
      });
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

async function savePreferences() {
  const saveBtn = document.getElementById('save-btn');
  saveBtn.style.opacity = '0.7';
  saveBtn.textContent = 'Saving...';

  try {
    const consents = [];
    ALL_PURPOSES.forEach(purpose => {
      const toggle = document.querySelector(`[data-purpose="${purpose}"]`);
      if (toggle) {
        consents.push({
          purpose: purpose,
          granted: toggle.checked
        });
      }
    });

    const createRes = await fetch(`${BASE_URL}/consents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: USER_ID,
        consents: consents
      })
    });

    if (createRes.ok) {
      alert("Preferences saved successfully!");
      await fetchConsents();
    } else {
      throw new Error(`Save failed: ${createRes.statusText}`);
    }

  } catch (err) {
    console.error("Save error:", err);
    alert("Failed to save preferences. Please try again.");
  } finally {
    saveBtn.style.opacity = '1';
    saveBtn.textContent = 'Save Preferences';
  }
}

async function fetchLogs() {
  try {
    const res = await fetch(`${BASE_URL}/logs/${USER_ID}`);
    if (res.ok) {
      const logs = await res.json();
      const tbody = document.getElementById('logs-tbody');
      tbody.innerHTML = '';

      logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const topLogs = logs.slice(0, 3);

      if (topLogs.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="3" class="text-center text-gray-500 py-4">No access logs found</td>
          </tr>
        `;
      } else {
        topLogs.forEach(log => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="font-medium">${log.action}</td>
            <td class="text-gray-600">${log.accessedBy}</td>
            <td class="text-sm text-gray-500">${new Date(log.timestamp).toLocaleString()}</td>
          `;
          tbody.appendChild(row);
        });
      }

      await updateChart();
    }
  } catch (err) {
    console.error("Error fetching logs:", err);
    const tbody = document.getElementById('logs-tbody');
    tbody.innerHTML = `
      <tr>
        <td class="font-medium">checkout_initiated</td>
        <td class="text-gray-600">internal_service</td>
        <td class="text-sm text-gray-500">${new Date().toLocaleString()}</td>
      </tr>
      <tr>
        <td class="font-medium">profile_viewed</td>
        <td class="text-gray-600">analytics_service</td>
        <td class="text-sm text-gray-500">${new Date(Date.now() - 86400000).toLocaleString()}</td>
      </tr>
    `;
  }
}

async function downloadLogsAsJSON() {
  try {
    const res = await fetch(`${BASE_URL}/logs/${USER_ID}`);
    if (res.ok) {
      const logs = await res.json();

      const dataStr = JSON.stringify(logs, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `access-logs-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    console.error('Error downloading JSON:', err);
    alert('Failed to download data. Please try again.');
  }
}

async function downloadLogsAsCSV() {
  try {
    const res = await fetch(`${BASE_URL}/logs/${USER_ID}`);
    if (res.ok) {
      const logs = await res.json();

      const csvData = logs.map(log => ({
        'Action': log.action,
        'Accessed By': log.accessedBy,
        'Date & Time': new Date(log.timestamp).toLocaleString(),
        'Timestamp': log.timestamp,
        'User ID': log.user || USER_ID,
        'Log ID': log._id || 'N/A'
      }));

      const headers = Object.keys(csvData[0] || {});
      const csvContent = [
        headers.join(','),
        ...csvData.map(row =>
          headers.map(header => {
            const value = row[header] || '';
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          }).join(',')
        )
      ].join('\n');

      const dataBlob = new Blob([csvContent], {type: 'text/csv'});

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `access-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    console.error('Error downloading CSV:', err);
    alert('Failed to download data. Please try again.');
  }
}

let isInitialized = false;

async function initializeDashboard() {
  if (isInitialized) return;
  isInitialized = true;

  await fetchConsents();
  await fetchLogs();
  await initializeChart();
}

document.getElementById('save-btn').addEventListener('click', savePreferences);

document.addEventListener('DOMContentLoaded', () => {
  initializeDashboard();

  document.getElementById('download-json')?.addEventListener('click', downloadLogsAsJSON);
  document.getElementById('download-csv')?.addEventListener('click', downloadLogsAsCSV);
});

window.addEventListener('focus', async () => {
  if (isInitialized) {
    await fetchConsents();
    await fetchLogs();
  }
});
