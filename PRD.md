# Product Requirements Document – VeriMark (Campus Attendance & Verification)

**BU-209 Backend Engineering – Week 4 Product Requirements Document**  
**Version:** 1.0 (MVP)

---

## 1. Problem and Background

Manual attendance recording for lectures, labs, chapels and hostels is currently both time consuming and inconsistent. Students may even allow others to sign for them, and if data is misplaced or incorrectly transcribed, genuine students cannot prove their presence.

### Primary users (attendees)
Students requiring a minimum level of attendance (to gain exam rights and/or hostel/chapel access, for example).

### Secondary users (session moderators)
Class reps, course assistants, hall and usher personnel. They collect and compile attendance data.

### Approving users
Lecturers and administrative support. They analyse and confirm final attendance data for each semester.

### Current solutions and issues
Following field research, there are typically three different types of solution currently being used on campus. Each suffers from its own issue.

**Physical paper-based attendance logging**  
It is disruptive and takes between 6–15 minutes, and it is open to heavy proxy signing. Following a session, someone must manually re-enter the information into an Excel/portal document, and matriculation numbers are frequently entered incorrectly.

**Verbal attendance**  
Although this reduces proxy attendance, it is not well suited to larger classes. Additionally, physical paper-based attendance data is still susceptible to misplacement or damage during a semester.

**Physical biometrics and ID card scanners**  
These cause queuing and add over 15 minutes to each session. Attendance can also still fail to be logged.

---

## 2. User Research and Field Research Results

### 2.1 Research approach
**Online survey:** An online survey (*Campus Attendance Experience and Bottlenecks*) was distributed to undergraduate students and received 4 responses (N = 4).

### 2.2 Notable quantitative data (N = 4)

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

## 3. Solution and MVP Definition

### 3.1 Value proposition
VeriMark is a fast, location specific digital attendance solution which can simultaneously log the attendance of an entire hall in under 90 seconds. It prevents proxies from remotely signing for students and produces an instant, secure verification of attendance for students.

### 3.2 System roles
- **Student:** Logs onto live sessions and can view their attendance percentage for each course. They can also lodge a dated dispute regarding their attendance.
- **Session moderator:** Class reps and/or ushers open and close attendance periods on behalf of a lecturer/organiser. Moderators can also manage in-situ attendance issues (such as phone power loss).
- **Lecturer/Organiser:** Sets up new courses and events and specifies minimum attendance criteria (for example 75%). They can also analyse session attendance data, approve or reject disputes and produce final attendance reports.

### 3.3 MVP definition (Version 1 – covering lectures and labs)
- **Session management:** Define a session including course code, location and start time, along with the period of time in which attendance can be logged.
- **Session-specific, time-sensitive token:** A session token is continually updated every 15–30 seconds, preventing students in the hall from texting it to friends in the hostel for proxy attendance.
- **One device per session:** Limits the number of matriculation numbers that can be logged by one device for a given session.
- **Instant digital verification:** Successful attendance logging generates a dated verification and a unique verification ID. This gives students demonstrable evidence that they were present.
- **Automated attendance calculation:** Instantly calculates `(Sessions Attended / Total Sessions Held) * 100`, without needing to manually re-enter data into Excel.

### 3.4 Out of scope (for future versions)
- Hostel exeat/roll call and Chapel credit functionality (currently on hold pending validation of the Lecture/Lab MVP).
- Biometric and RFID card hardware.
- Mesh networked peer-to-peer data synchronisation, for use if there is a total campus internet outage.

---

## 4. Functional Requirements

### 4.1 Session opening and attendance logging
1. A lecturer or approved class rep opens a session for a particular course.
2. The system activates the session (`ACTIVE`) and starts a continually updating session token.
3. During the open period, students submit their matriculation number and the current session token (or the previous one, for a brief grace period).
4. The system verifies that:
   - The session is `ACTIVE`.
   - The token corresponds to the current (or previous) token.
   - The student's matriculation number is registered on the relevant course and they have not already logged their attendance (otherwise the request is rejected with `DUPLICATE_CHECKIN`).
   - No other student has already logged attendance using the same device in this session (otherwise the request is rejected with `DEVICE_LIMIT_EXCEEDED`).
5. The system stores the student's attendance record (non-editable) and issues a verification ID.
6. Either the session moderator or the system closes the session, changing its status to `CLOSED`.

### 4.2 Session moderation and dispute resolution
1. **In-session manual override** (for example, no device or no data): A student who cannot use a device approaches the session moderator before the session closes. The moderator logs an `OVERRIDE_PRESENT` entry using their own moderator ID for accountability.
2. **Post-session dispute:** Within 24 hours of a `CLOSED` session, a student who experienced a technical problem can lodge a dispute. The lecturer considers it and either confirms it (changing the status to `VERIFIED_PRESENT`) or denies it. An audit trail is created in either case detailing who made the change, when and why.

### 4.3 Important business rules and exceptional circumstances
- **Late arrivals:** Sessions may include a `LATE` period (for example 15–30 minutes after the session has started). This is tracked separately from `PRESENT` and is subject to the lecturer's rules.
- **Session cancellation:** A cancelled session is labelled `CANCELLED` rather than deleted, so it is not included in the calculation of attendance percentages.
- **Audit data integrity:** Underlying attendance data cannot be silently altered. If a session moderator or lecturer manually changes data, a read-only audit record is produced detailing who made the change, when and why.

---

## 5. Non-Functional Requirements and Campus Considerations
- **High concurrency:** The system must process 150–300 simultaneous attendance log-ins within a 60 second period at the end of a lecture, without timeouts.
- **Low bandwidth:** Data should be kept to a minimum so students can log their attendance even in a large, solidly constructed lecture hall with limited mobile data.
- **Data confidentiality and integrity:** Attendance and matriculation data must be securely maintained, and device information should be hashed, not stored in plain text.

---

## 6. Measures of Success
- **Faster attendance logging:** Reduce attendance logging time from 6+ minutes per session to under 2 minutes.
- **Eliminate post-session disputes:** By giving all students a verifiable verification ID, disputes about attendance after the session can be avoided.
- **No manual data entry:** Direct structured export means class reps and lecturers can reduce their post-session manual data input to zero minutes.
