/**
 * System Analysis page — Chart.js visualizations.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    if (typeof Chart === "undefined") return;

    Chart.defaults.font.family = "'Poppins', system-ui, sans-serif";
    Chart.defaults.color = "#5c3d1e";

    var barEl = document.getElementById("barChart");
    if (barEl) {
      new Chart(barEl, {
        type: "bar",
        data: {
          labels: ["10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"],
          datasets: [{
            label: "Unrecorded orders (rush estimate)",
            data: [2, 4, 6, 9, 11, 8, 5, 7, 4],
            backgroundColor: [
              "#5b8def", "#7b5fd4", "#e8913a", "#e8c547",
              "#e85a5a", "#e85aa8", "#4ec9b0", "#6bc96b", "#9b7bd4"
            ],
            borderRadius: 4,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "Peak hours when orders outpace manual logging",
              font: { size: 11, weight: "600" }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 10, weight: "600" }, color: "#5c3d1e" }
            },
            y: {
              beginAtZero: true,
              max: 14,
              title: { display: true, text: "Missed / delayed logs", font: { size: 10 } },
              grid: { color: "rgba(92, 61, 30, 0.12)" },
              ticks: { stepSize: 2, font: { size: 10 } }
            }
          }
        }
      });
    }

    var lineEl = document.getElementById("lineChart");
    if (lineEl) {
      new Chart(lineEl, {
        type: "line",
        data: {
          labels: ["Order 1", "Order 2", "Order 3", "Order 4", "Order 5", "Order 6", "Order 7"],
          datasets: [
            {
              label: "Manual recording (min)",
              data: [3, 4, 5, 6, 7, 6, 5],
              borderColor: "#c45c26",
              borderWidth: 2.5,
              tension: 0.35,
              pointRadius: 3,
              pointBackgroundColor: "#c45c26"
            },
            {
              label: "Pay-first goal (min)",
              data: [2, 2, 2, 2, 2, 2, 2],
              borderColor: "#2d6a4f",
              borderWidth: 2.5,
              borderDash: [6, 4],
              tension: 0.2,
              pointRadius: 3,
              pointBackgroundColor: "#2d6a4f"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: { boxWidth: 12, font: { size: 10 } }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 10,
              title: { display: true, text: "Minutes per order", font: { size: 10 } },
              grid: { color: "rgba(92, 61, 30, 0.15)" }
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 9 }, maxRotation: 0 }
            }
          }
        }
      });
    }
  });
})();
