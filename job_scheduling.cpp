// ============================================================
//  Job Scheduling with Deadlines — job_scheduling.cpp
//  Greedy Algorithm · C++ Implementation
//
//  Compile: g++ -o job_scheduler job_scheduling.cpp
//  Run    : ./job_scheduler
// ============================================================

#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <iomanip>
using namespace std;

// ── Job structure ─────────────────────────────────────────────
struct Job {
    string id;        // unique identifier, e.g. "J1"
    int    deadline;  // must complete by this time unit (1-indexed)
    int    profit;    // reward for completing this job
};

// ── Greedy Job Scheduling ─────────────────────────────────────
// Algorithm:
//   1. Sort jobs by PROFIT (descending) — greedy choice.
//   2. For each job, find the LATEST free slot <= deadline.
//   3. If found, place the job; otherwise skip.
//
// Why greedy works: By always trying the highest-profit job
// first, we ensure that any slot used gives maximum value.
//
// Time complexity : O(n²)   — outer loop n, inner loop O(n)
// Space complexity: O(n)    — slot array of size maxDeadline

void scheduleJobs(vector<Job> jobs) {

    // ── Step 1: Sort jobs by profit in descending order ───────
    sort(jobs.begin(), jobs.end(), [](const Job& a, const Job& b) {
        return a.profit > b.profit;
    });

    cout << "\n[Sorted order by profit (desc)]\n";
    for (auto& j : jobs)
        cout << "  " << j.id << " | deadline=" << j.deadline
             << " | profit=" << j.profit << "\n";

    // ── Step 2: Determine how many time slots we need ─────────
    int maxDeadline = 0;
    for (auto& j : jobs)
        maxDeadline = max(maxDeadline, j.deadline);

    // slots[i] = job ID assigned to time slot (i+1).
    // Empty string means the slot is free.
    vector<string> slots(maxDeadline, "");

    // ── Step 3: Greedy assignment ─────────────────────────────
    int           totalProfit = 0;
    vector<string> selected;

    cout << "\n[Greedy assignment trace]\n";

    for (auto& job : jobs) {
        cout << "  Considering " << job.id
             << " (profit=" << job.profit
             << ", deadline=" << job.deadline << ")\n";

        bool placed = false;

        // Scan from the latest slot back to slot 1
        for (int s = job.deadline - 1; s >= 0; s--) {
            if (slots[s].empty()) {          // free slot found
                slots[s]     = job.id;
                totalProfit += job.profit;
                selected.push_back(job.id);
                placed = true;
                cout << "    → Placed in time slot " << (s + 1) << "\n";
                break;
            }
        }

        if (!placed)
            cout << "    ✗ No free slot — skipped\n";
    }

    // ── Step 4: Print results ─────────────────────────────────
    cout << "\n╔══════════════════════════════════╗\n";
    cout << "║       SCHEDULING RESULT          ║\n";
    cout << "╚══════════════════════════════════╝\n";

    cout << "\nSelected jobs : ";
    for (auto& id : selected) cout << id << " ";
    cout << "\n";

    cout << "Total profit  : " << totalProfit << "\n";

    cout << "\nTime slot layout:\n";
    for (int i = 0; i < maxDeadline; i++) {
        cout << "  Slot " << (i + 1) << " -> "
             << (slots[i].empty() ? "[empty]" : slots[i]) << "\n";
    }
    cout << "\n";
}

// ── Main ──────────────────────────────────────────────────────
// Modify the jobs vector below to test with different inputs.

int main() {

    // Example dataset (classic textbook example)
    // J1: deadline=2, profit=100
    // J2: deadline=1, profit=19
    // J3: deadline=2, profit=27
    // J4: deadline=1, profit=25
    // J5: deadline=3, profit=15
    // Expected output: J1, J3, J5  →  profit = 142

    vector<Job> jobs = {
        {"J1", 2, 100},
        {"J2", 1, 19 },
        {"J3", 2, 27 },
        {"J4", 1, 25 },
        {"J5", 3, 15 },
    };

    cout << "====================================\n";
    cout << "  Job Scheduling with Deadlines\n";
    cout << "  Greedy Algorithm — C++ Demo\n";
    cout << "====================================\n";

    cout << "\n[Input jobs]\n";
    cout << left
         << setw(8)  << "Job ID"
         << setw(12) << "Deadline"
         << "Profit\n";
    cout << string(28, '-') << "\n";
    for (auto& j : jobs)
        cout << setw(8)  << j.id
             << setw(12) << j.deadline
             << j.profit << "\n";

    scheduleJobs(jobs);

    return 0;
}

// ── How to extend ─────────────────────────────────────────────
// 1. Accept input from the user:
//    Replace the hardcoded jobs vector with cin-based input.
//
// 2. Read from a file:
//    Use ifstream to read job data from a CSV or text file.
//
// 3. Improve to O(n log n):
//    Use a Union-Find (Disjoint Set) data structure to find
//    free slots in near-constant time, reducing total complexity
//    from O(n²) to O(n log n).
