# Product Requirements Document – VeriMark (Campus Attendance & Verification)

**Product name:** VeriMark  
**BU-209 Backend Engineering – Week 4 Product Requirements Document**  
**Version:** 1.0 (MVP)

---

## 1. Product Overview

VeriMark is a fast, location specific digital attendance solution which can simultaneously log the attendance of an entire hall in under 90 seconds. It prevents proxies from remotely signing for students and produces an instant, secure verification of attendance for students.

---

## 2. Problem Statement

Manual attendance recording for lectures, labs, chapels and hostels is currently both time consuming and inconsistent. Students may even allow others to sign for them, and if data is misplaced or incorrectly transcribed, genuine students cannot prove their presence.

### Current solutions and issues
Following field research, there are typically three different types of solution currently being used on campus. Each suffers from its own issue.

**Physical paper-based attendance logging**  
It is disruptive and takes between 6–15 minutes, and it is open to heavy proxy signing. Following a session, someone must manually re-enter the information into an Excel/portal document, and matriculation numbers are frequently entered incorrectly.

**Verbal attendance**  
Although this reduces proxy attendance, it is not well suited to larger classes. Additionally, physical paper-based attendance data is still susceptible to misplacement or damage during a semester.

**Physical biometrics and ID card scanners**  
These cause queuing and add over 15 minutes to each session. Attendance can also still fail to be logged.

### User research and field research results

**Research approach**  
An online survey (*Campus Attendance Experience and Bottlenecks*) was distributed to undergraduate students and received 4 responses (N = 4).

**Notable quantitative data (N = 4)**

**Attendance is required in multiple settings**  
All 4 students (100%) deal with attendance in both Lectures & Labs and Hostel Roll Call/Exeat. 75% also experience Chapel and/or Mandatory Assembly attendance requirements.

**Time lost**  
75% of students said they spend 6 minutes or more on attendance activities in each session (50% in the 6–15 minute range and 25% over 15 minutes).

**False absence**  
All 4 students had been incorrectly marked absent for at least one session which they did attend (75% once or twice and 25% multiple times).

**Proxy attendance**  
On average, students gave a score of 3.0 out of 5.0 for how common proxy attendance was. This rose to 4.0 out of 5.0 for sessions using paper-based attendance logging.

**Chaotic post-session scenarios**  
50% of students said attendance data is manually entered into Excel/portal documents after a session, which can result in data entry mistakes. Typically, if a student's name is not recognised, then either the class rep gets into a dispute with the student (50%) or an unchecked amendment is made (25%).

---

## 3. Business Objectives

**Measures of success**
- **Faster attendance logging:** Reduce attendance logging time from 6+ minutes per session to under 2 minutes.
- **Eliminate post-session disputes:** By giving all students a verifiable verification ID, disputes about attendance after the session can be avoided.
- **No manual data entry:** Direct structured export means class reps and lecturers can reduce their post-session manual data input to zero minutes.

---

## 4. Target Users

- **Student:** Logs onto live sessions and can view their attendance percentage for each course. They can also lodge a dated dispute regarding their attendance.
- **Session moderator:** Class reps and/or ushers open and close attendance periods on behalf of a lecturer/organiser. Moderators can also manage in-situ attendance issues (such as phone power loss).
- **Lecturer/Organiser:** Sets up new courses and events and specifies minimum attendance criteria (for example 75%). They can also analyse session attendance data, approve or reject disputes and produce final attendance reports.

---

## 5. Stakeholders

| Stakeholder | Interest |
| --- | --- |
| Primary users (attendees) | Students requiring a minimum level of attendance (to gain exam rights and/or hostel/chapel access, for example). |
| Secondary users (session moderators) | Class reps, course assistants, hall and usher personnel. They collect and compile attendance data. |
| Approving users | Lecturers and administrative support. They analyse and confirm final attendance data for each semester. |

---

## 6. User Stories

- As a student, I want to log my attendance on a live session so that my presence is recorded.
- As a student, I want to receive a verification ID so that I can show I was present.
- As a student, I want to view my attendance percentage for each course so that I know whether I meet the minimum requirement.
- As a student, I want to lodge a dispute within 24 hours of a closed session so that a technical problem does not cost me my attendance.
- As a session moderator, I want to open and close attendance periods so that attendance can only be logged during the session.
- As a session moderator, I want to log a manual override for a student without a working device so that they are still recorded as present.
- As a lecturer, I want to set minimum attendance criteria so that eligibility is calculated automatically.
- As a lecturer, I want to approve or reject disputes so that every change is controlled and traceable.
- As a lecturer, I want to produce final attendance reports so that nobody has to re-enter data into Excel.

---

## 7. Functional Requirements

### MVP features (Version 1 – covering lectures and labs)
- **FR-01 Session management:** Define a session including course code, location and start time, along with the period of time in which attendance can be logged.
- **FR-02 Session-specific, time-sensitive token:** A session token is continually updated every 15–30 seconds, preventing students in the hall from texting it to friends in the hostel for proxy attendance.
- **FR-03 One device per session:** Limits the number of matriculation numbers that can be logged by one device for a given session.
- **FR-04 Instant digital verification:** Successful attendance logging generates a dated verification and a unique verification ID. This gives students demonstrable evidence that they were present.
- **FR-05 Automated attendance calculation:** Instantly calculates `(Sessions Attended / Total Sessions Held) * 100`, without needing to manually re-enter data into Excel.

### Session opening and attendance logging
- **FR-06** A lecturer or approved class rep opens a session for a particular course.
- **FR-07** The system activates the session (`ACTIVE`) and starts a continually updating session token.
- **FR-08** During the open period, students submit their matriculation number and the current session token (or the previous one, for a brief grace period).
- **FR-09** The system verifies that:
  - The session is `ACTIVE`.
  - The token corresponds to the current (or previous) token.
  - The student's matriculation number is registered on the relevant course and they have not already logged their attendance (otherwise the request is rejected with `DUPLICATE_CHECKIN`).
  - No more than one student can log attendance using one device in a given session (otherwise the request is rejected with `DEVICE_LIMIT_EXCEEDED`).
- **FR-10** The system stores the student's attendance record (non-editable) and issues a verification ID.
- **FR-11** Either the session moderator or the system closes the session, changing its status to `CLOSED`.

### Session moderation and dispute resolution
- **FR-12 In-session manual override** (for example, no device or no data): A student who cannot use a device approaches the session moderator before the session closes. The moderator logs an `OVERRIDE_PRESENT` entry using their own moderator ID for accountability.
- **FR-13 Post-session dispute:** Within 24 hours of a `CLOSED` session, a student who experienced a technical problem can lodge a dispute. The lecturer considers it and either confirms it (changing the status to `VERIFIED_PRESENT`) or denies it. An audit trail is created in either case detailing who made the change, when and why.

### Important business rules and exceptional circumstances
- **FR-14 Late arrivals:** Sessions may include a `LATE` period (for example 15–30 minutes after the session has started). This is tracked separately from `PRESENT` and is subject to the lecturer's rules.
- **FR-15 Session cancellation:** A cancelled session is labelled `CANCELLED` rather than deleted, so it is not included in the calculation of attendance percentages.
- **FR-16 Audit data integrity:** Underlying attendance data cannot be silently altered. If a session moderator or lecturer manually changes data, a read-only audit record is produced detailing who made the change, when and why.

---

## 8. Non-Functional Requirements

| Category | VeriMark requirement |
| --- | --- |
| High concurrency | The system must process 150–300 simultaneous attendance log-ins within a 60 second period at the end of a lecture, without timeouts. |
| Low bandwidth | Data should be kept to a minimum so students can log their attendance even in a large, solidly constructed lecture hall with limited mobile data. |
| Data confidentiality and integrity | Attendance and matriculation data must be securely maintained, and device information should be hashed, not stored in plain text. |

---

## 9. Scope and Priorities

**MVP (Version 1):** covering lectures and labs.

| Priority | Items |
| --- | --- |
| **Must have** | Session management; session token; one device per session; instant digital verification; automated attendance calculation (FR-01 to FR-11, FR-15, FR-16). |
| **Should have** | In-session manual override and post-session dispute (FR-12, FR-13); direct structured export of attendance reports. |
| **Could have** | `LATE` period (FR-14). |
| **Won't have (this release)** | Hostel exeat/roll call and Chapel credit functionality (currently on hold pending validation of the Lecture/Lab MVP); biometric and RFID card hardware; mesh networked peer-to-peer data synchronisation, for use if there is a total campus internet outage. |

---

## 10. Acceptance Criteria

**Student attendance logging**

*User story: As a student, I want to log my attendance on a live session so that my presence is recorded.*

- The session is live (`ACTIVE`).
- The token corresponds to the current (or previous) token.
- The student's matriculation number is registered on the relevant course and they have not already logged their attendance (otherwise `DUPLICATE_CHECKIN` rejection).
- No more than one student can log attendance using one device in a given session (otherwise `DEVICE_LIMIT_EXCEEDED` rejection).
- The system stores the student's attendance record (non-editable) and issues a verification ID.

**Post-session dispute**

*User story: As a student, I want to lodge a dispute within 24 hours of a closed session so that a technical problem does not cost me my attendance.*

- The dispute is lodged within 24 hours of a `CLOSED` session.
- The lecturer either confirms it (status changes to `VERIFIED_PRESENT`) or denies it.
- An audit trail is created in either case detailing who made the change, when and why.

---

## 11. Assumptions and Open Questions

**Assumptions**
- Students have a device and mobile data to log their attendance.
- Students' matriculation numbers are registered on the relevant course.

**Open questions**
- How will the "location specific" restriction be enforced in the MVP?
- How will a device be identified for the one device per session rule?
