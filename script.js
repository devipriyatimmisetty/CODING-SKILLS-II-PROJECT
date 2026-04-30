// ============================================================
//  Job Scheduling with Deadlines — script.js
//  Greedy Algorithm (JavaScript implementation)
//  This mirrors the logic in job_scheduling.cpp
// ============================================================

// ── Core Algorithm ────────────────────────────────────────────
// Input : array of job objects { id, deadline, profit }
// Output: { selected, totalProfit, slots, steps }
//
// Strategy (Greedy):
//   1. Sort jobs by profit in DESCENDING order.
//   2. For each job (most profitable first), find the LATEST
//      free time slot that is <= job's deadline.
//   3. If a free slot is found, assign the job to it.
//   4. Otherwise, skip the job.
//
// Time complexity : O(n²)  — two nested loops
// Space complexity: O(n)   — slot array of size maxDeadline

function jobScheduling(jobs) {
  // Step 1 — sort by profit descending
  const sorted = [...jobs].sort((a, b) => b.profit - a.profit);

  // Step 2 — find maximum deadline (determines how many slots we need)
  const maxDeadline = Math.max(...jobs.map(j => j.deadline));

  // Step 3 — initialise time slots; empty string = free slot
  // slots[0] = time slot 1, slots[1] = time slot 2, …
  const slots = new Array(maxDeadline).fill('');

  const selected   = [];  // jobs that got scheduled
  let   totalProfit = 0;
  const steps       = []; // trace log for the UI

  // Step 4 — greedy assignment
  for (const job of sorted) {
    steps.push({ type: 'consider', job });

    let placed = false;

    // Find the LATEST free slot on or before the deadline
    for (let s = job.deadline - 1; s >= 0; s--) {
      if (slots[s] === '') {                // slot is free
        slots[s] = job.id;                  // assign job
        selected.push({ ...job, slot: s + 1 }); // slot is 1-indexed for display
        totalProfit += job.profit;
        placed = true;
        steps.push({ type: 'placed', job, slot: s + 1 });
        break;
      }
    }

    if (!placed) {
      steps.push({ type: 'skipped', job });
    }
  }

  return { selected, totalProfit, slots, maxDeadline, steps };
}


// ── UI Helpers ────────────────────────────────────────────────

function show(id) {
  document.getElementById(id).classList.remove('hidden');
}

function hide(id) {
  document.getElementById(id).classList.add('hidden');
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.remove('hidden');
}

function clearError(id) {
  document.getElementById(id).classList.add('hidden');
}

// Switch between result tabs
function showTab(name, clickedBtn) {
  // Hide all tab panels
  document.getElementById('tab-schedule').classList.add('hidden');
  document.getElementById('tab-trace').classList.add('hidden');

  // Show the selected panel
  document.getElementById('tab-' + name).classList.remove('hidden');

  // Update tab button styles
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  clickedBtn.classList.add('active');
}


// ── Step 1 — Generate Input Rows ──────────────────────────────
// Creates one table row per job so the user can fill in details.

function generateJobInputs() {
  clearError('err-count');

  const n = parseInt(document.getElementById('numJobs').value);

  if (!n || n < 1 || n > 12) {
    showError('err-count', 'Please enter a number between 1 and 12.');
    return;
  }

  const tbody = document.getElementById('jobTableBody');
  tbody.innerHTML = ''; // clear previous rows

  for (let i = 1; i <= n; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="color:#888;font-size:12px;">${i}</td>
      <td><input type="text"   id="jid${i}" placeholder="J${i}"  value="J${i}"  /></td>
      <td><input type="number" id="jdl${i}" placeholder="1"  min="1" value="${Math.min(i, 4)}" /></td>
      <td><input type="number" id="jpr${i}" placeholder="10" min="0" value="${(n - i + 1) * 20}" /></td>
    `;
    tbody.appendChild(row);
  }

  show('step-jobs');
  // Hide results from a previous run
  hide('step-result');
}


// ── Demo Data ─────────────────────────────────────────────────
// Loads a classic textbook example so users can explore quickly.

function loadDemo() {
  const demoJobs = [
    { id: 'J1', deadline: 2, profit: 100 },
    { id: 'J2', deadline: 1, profit: 19  },
    { id: 'J3', deadline: 2, profit: 27  },
    { id: 'J4', deadline: 1, profit: 25  },
    { id: 'J5', deadline: 3, profit: 15  },
  ];

  document.getElementById('numJobs').value = demoJobs.length;
  generateJobInputs();

  // Fill in demo values
  demoJobs.forEach((j, i) => {
    document.getElementById(`jid${i + 1}`).value = j.id;
    document.getElementById(`jdl${i + 1}`).value = j.deadline;
    document.getElementById(`jpr${i + 1}`).value = j.profit;
  });
}


// ── Step 2 — Read Inputs & Run Algorithm ──────────────────────

function calculateSchedule() {
  clearError('err-jobs');

  const n = parseInt(document.getElementById('numJobs').value);
  const jobs = [];

  for (let i = 1; i <= n; i++) {
    const id       = document.getElementById(`jid${i}`).value.trim() || `J${i}`;
    const deadline = parseInt(document.getElementById(`jdl${i}`).value);
    const profit   = parseInt(document.getElementById(`jpr${i}`).value);

    // Validate inputs
    if (!deadline || deadline < 1) {
      showError('err-jobs', `Job "${id}": deadline must be at least 1.`);
      return;
    }
    if (isNaN(profit) || profit < 0) {
      showError('err-jobs', `Job "${id}": profit must be a non-negative number.`);
      return;
    }

    jobs.push({ id, deadline, profit });
  }

  if (!jobs.length) return;

  // ── Run the greedy algorithm
  const { selected, totalProfit, slots, maxDeadline, steps } = jobScheduling(jobs);

  // ── Render: selected job chips
  const selSet = new Set(selected.map(j => j.id));

  document.getElementById('selectedJobs').innerHTML = selected.length
    ? selected.map(j =>
        `<div class="chip">${j.id}<span class="chip-sub">+${j.profit}</span></div>`
      ).join('')
    : '<span style="color:#aaa;font-size:13px;">No jobs could be scheduled.</span>';

  // ── Render: time slot timeline
  document.getElementById('slotTimeline').innerHTML = slots.map((v, i) =>
    `<div class="slot ${v ? 'filled' : ''}">
       ${v || '—'}
       <span class="slot-num">t${i + 1}</span>
     </div>`
  ).join('');

  // ── Render: profit banner
  document.getElementById('totalProfit').textContent = totalProfit;

  // ── Render: detail table showing every job's status
  document.getElementById('detailTableWrapper').innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Job ID</th>
          <th>Deadline</th>
          <th>Profit</th>
          <th>Assigned Slot</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${jobs.map(j => {
          const sel = selected.find(s => s.id === j.id);
          return `<tr>
            <td style="font-weight:600;font-family:'JetBrains Mono',monospace">${j.id}</td>
            <td>${j.deadline}</td>
            <td style="font-family:'JetBrains Mono',monospace">+${j.profit}</td>
            <td style="font-family:'JetBrains Mono',monospace">${sel ? `t${sel.slot}` : '—'}</td>
            <td class="${sel ? 'status-ok' : 'status-no'}">${sel ? '✓ Scheduled' : '✗ Skipped'}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;

  // ── Render: algorithm trace
  document.getElementById('traceBox').innerHTML = steps.map(s => {
    if (s.type === 'consider')
      return `<div class="trace-item">Considering ${s.job.id} (profit=${s.job.profit}, deadline=${s.job.deadline})</div>`;
    if (s.type === 'placed')
      return `<div class="trace-item placed">  → Placed ${s.job.id} in time slot ${s.slot}</div>`;
    if (s.type === 'skipped')
      return `<div class="trace-item skipped">  ✗ No free slot available — ${s.job.id} skipped</div>`;
    return '';
  }).join('');

  // ── Show results section
  show('step-result');
  document.getElementById('step-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// ── Reset ─────────────────────────────────────────────────────

function resetAll() {
  hide('step-jobs');
  hide('step-result');
  document.getElementById('numJobs').value   = '';
  document.getElementById('jobTableBody').innerHTML = '';
  document.getElementById('step-count').scrollIntoView({ behavior: 'smooth' });
}
