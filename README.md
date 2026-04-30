# CODING-SKILLS-II-PROJECT

# Job Scheduling with Deadlines

A visual and interactive implementation of the **Job Scheduling with Deadlines** greedy algorithm using **HTML, CSS, JavaScript**, along with a **C++ reference implementation**.

This project demonstrates how jobs with deadlines and profits can be scheduled to maximize total profit by selecting the most profitable jobs first and assigning them to the latest available valid slot.

---

## Problem Statement

Given a set of jobs where each job has:

* Job ID
* Deadline
* Profit

Each job takes **1 unit of time**, and only one job can be executed in one time slot.

### Objective:

* Maximize total profit
* Complete jobs before deadlines

---

## Features

* Interactive web interface for entering job data
* Automatic generation of job input fields
* Demo dataset support
* Greedy scheduling visualization
* Time-slot assignment display
* Algorithm trace step-by-step
* Profit calculation
* Detailed scheduling result table
* C++ implementation included

---

## Algorithm Used

This project uses the **Greedy Algorithm**:

1. Sort jobs in descending order of profit
2. Pick the highest-profit job first
3. Assign it to the latest available slot before its deadline
4. Skip the job if no slot is available

---

## Time Complexity

* Sorting: **O(n log n)**
* Slot assignment: **O(n²)**

Overall complexity: **O(n²)**

---

## Project Structure

```bash
├── index.html
├── style.css
├── script.js
├── job_scheduling.cpp
```

---

## Technologies Used

* HTML5
* CSS3
* JavaScript
* C++

---

## How to Run

### Web Version

1. Download all files
2. Keep them in one folder
3. Open `index.html` in browser

### C++ Version

Compile:

```bash
g++ job_scheduling.cpp -o job_scheduler
```

Run:

```bash
./job_scheduler
```

---

## Example Input

| Job | Deadline | Profit |
| --- | -------- | ------ |
| J1  | 2        | 100    |
| J2  | 1        | 19     |
| J3  | 2        | 27     |
| J4  | 1        | 25     |
| J5  | 3        | 15     |

## Output

Selected Jobs: **J1, J3, J5**
Total Profit: **142**

---

## Learning Purpose

This project helps understand:

* Greedy strategy
* Deadline scheduling
* Profit optimization
* Visual simulation of algorithms

---

## Future Improvements

* Add animation for scheduling
* Support larger datasets
* Export results
* Add drag-and-drop job input
