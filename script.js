const modules = [
  {
    icon: '⚡',
    title: 'Electrical Safety Fundamentals',
    level: 'Core',
    duration: '35 min',
    progress: 82,
    summary: 'Lockout/tagout, PPE checks, hazard recognition, and working safely around energized systems.',
  },
  {
    icon: '🧰',
    title: 'Residential Wiring Practice',
    level: 'Hands-on',
    duration: '28 min',
    progress: 64,
    summary: 'Cable routing, socket circuits, switch loops, and compliant installation standards for domestic systems.',
  },
  {
    icon: '🔌',
    title: 'Circuit Protection & Fault Finding',
    level: 'Practical',
    duration: '40 min',
    progress: 71,
    summary: 'Reading trip curves, testing breakers, diagnosing overloads, short circuits, and earth faults.',
  },
  {
    icon: '🛠️',
    title: 'Panel Maintenance & Commissioning',
    level: 'Advanced',
    duration: '52 min',
    progress: 49,
    summary: 'Inspection of distribution boards, labeling, torque verification, and safe energization procedures.',
  },
  {
    icon: '🔧',
    title: 'Three-Phase Motor Controls',
    level: 'Specialist',
    duration: '46 min',
    progress: 58,
    summary: 'Starter circuits, overload relays, phase sequence testing, and troubleshooting abnormal motor behavior.',
  },
];

const checklist = [
  'Isolate the circuit and apply lockout/tagout',
  'Verify absence of voltage with approved tester',
  'Inspect insulation, gloves, and arc-rated PPE',
  'Confirm instrument range and correct lead placement',
  'Document fault findings and restoration steps',
];

const skillLevels = [
  { name: 'Lockout verification', value: 93 },
  { name: 'Fault finding', value: 81 },
  { name: 'Panel wiring', value: 68 },
  { name: 'Load calculations', value: 89 },
  { name: 'Motor control', value: 57 },
];

const quizItems = [
  {
    question: 'Before opening a live panel, what is the primary legal and practical control?',
    options: ['Apply lockout/tagout and verify isolation', 'Remove the breaker first without checking', 'Work with one hand only in a dry room', 'Begin with the load side to test continuity'],
    answer: 0,
  },
  {
    question: 'What is the correct sequence when diagnosing a tripping circuit breaker?',
    options: ['Inspect the load, isolate supply, verify cause, restore safely', 'Replace the breaker immediately', 'Increase load to confirm the issue', 'Re-energize without inspection'],
    answer: 0,
  },
  {
    question: 'Why is a voltage tester used after lockout before work begins?',
    options: ['To confirm the circuit is truly dead and no stored energy remains', 'To measure the exact fault current', 'To test the fuse rating', 'To identify the cable color code'],
    answer: 0,
  },
  {
    question: 'A motor that hums but does not rotate is most likely showing:',
    options: ['Stalled rotor or failed starting mechanism', 'Correct phase rotation', 'A healthy insulation resistance', 'An overvoltage supply issue only'],
    answer: 0,
  },
];

const labTasks = [
  { title: 'Install a 3-way switch circuit', detail: 'Wire, verify, and document the control path with safe isolation checks', tag: 'Lab 01' },
  { title: 'Breaker fault isolation drill', detail: 'Identify trip conditions, isolate affected circuits, and confirm safe restoration', tag: 'Lab 02' },
  { title: 'Motor overload troubleshooting', detail: 'Analyze current draw, thermal conditions, and starter relay operation', tag: 'Lab 03' },
  { title: 'Panel label and torque review', detail: 'Check breaker labeling, conductor terminations, and service readiness', tag: 'Lab 04' },
];

const scheduleItems = [
  { title: 'Introduction to lockout/tagout procedure', time: 'Tue • 9:00 AM', tag: 'Workshop' },
  { title: 'Commercial wiring and cable routing review', time: 'Wed • 1:30 PM', tag: 'Practical' },
  { title: 'Breaker testing and fault diagnosis lab', time: 'Thu • 10:15 AM', tag: 'Lab' },
  { title: 'Field mentor evaluation and sign-off', time: 'Fri • 11:00 AM', tag: 'Assessment' },
];

const courseCatalog = [
  { title: 'Install & terminate final circuits', detail: 'Cable selection, routing, insulation protection, and secure mounting for safe final circuits.', badge: 'Level 2' },
  { title: 'Single and three-phase distribution', detail: 'Balance loads, identify phase arrangements, and understand current flow through protection devices.', badge: 'Level 3' },
  { title: 'Testing and verification', detail: 'Use continuity, insulation resistance, and voltage checks to commission systems safely.', badge: 'Core' },
];

const safetyProtocols = [
  { title: 'Permit to work', detail: 'Confirm job scope, isolate area, and obtain clearance before starting electrical work.', badge: 'Required' },
  { title: 'Personal protective equipment', detail: 'Inspect gloves, eye protection, insulated tools, and arc-rated clothing before each task.', badge: 'Daily' },
  { title: 'Emergency response', detail: 'Follow emergency stops, first aid access points, and reporting protocols for electrical incidents.', badge: 'Critical' },
];

const lessonPlans = [
  { title: 'Safe isolation and verification', duration: '25 min', objective: 'Apply lockout and prove circuit de-energization before test or repair.' },
  { title: 'Cable sizing and voltage drop', duration: '32 min', objective: 'Calculate acceptable loss across long cable runs and check current loading.' },
  { title: 'Breakers, RCDs, and fault current', duration: '40 min', objective: 'Match protective devices to installation type and identify common failure modes.' },
];

const assessmentBreakdown = [
  { name: 'Safety knowledge', score: '96%' },
  { name: 'Practical installation', score: '88%' },
  { name: 'Fault diagnosis', score: '91%' },
  { name: 'Commissioning', score: '84%' },
];

const resources = [
  { title: 'Electrical installation handbook', tag: 'PDF' },
  { title: 'Lockout procedure checklist', tag: 'Checklist' },
  { title: 'Three-phase motor troubleshooting guide', tag: 'Guide' },
  { title: 'Insulation resistance testing notes', tag: 'Notes' },
];

const moduleList = document.getElementById('moduleList');
const checklistList = document.getElementById('checklist');
const skillList = document.getElementById('skillList');
const quizList = document.getElementById('quizList');
const labList = document.getElementById('labList');
const scheduleList = document.getElementById('scheduleList');
const courseCatalogList = document.getElementById('courseCatalog');
const protocolList = document.getElementById('protocolList');
const lessonList = document.getElementById('lessonList');
const assessmentList = document.getElementById('assessmentList');
const resourceList = document.getElementById('resourceList');
const completionRate = document.getElementById('completionRate');

function renderModules() {
  moduleList.innerHTML = modules
    .map(
      (module) => `
        <article class="module-item">
          <div class="module-icon">${module.icon}</div>
          <div>
            <h4 class="module-title">${module.title}</h4>
            <div class="module-meta">
              <span>${module.level}</span>
              <span>${module.duration}</span>
            </div>
            <p class="module-summary">${module.summary}</p>
          </div>
          <div class="module-progress">
            <strong>${module.progress}%</strong>
            <div class="progress-bar">
              <span style="width:${module.progress}%"></span>
            </div>
          </div>
        </article>
      `
    )
    .join('');
}

function renderChecklist() {
  checklistList.innerHTML = checklist
    .map(
      (item, index) => `
        <li>
          <input type="checkbox" ${index < 3 ? 'checked' : ''} />
          <span>${item}</span>
        </li>
      `
    )
    .join('');
}

function renderSkills() {
  skillList.innerHTML = skillLevels
    .map(
      (skill) => `
        <div class="skill-row">
          <label>${skill.name}</label>
          <div class="bar"><span style="width: ${skill.value}%"></span></div>
          <strong>${skill.value}%</strong>
        </div>
      `
    )
    .join('');
}

function renderQuiz() {
  quizList.innerHTML = quizItems
    .map(
      (item, questionIndex) => `
        <article class="quiz-item">
          <p>${questionIndex + 1}. ${item.question}</p>
          <div class="quiz-options">
            ${item.options
              .map(
                (option, optionIndex) => `
                  <button class="answer-btn" data-question="${questionIndex}" data-option="${optionIndex}">
                    ${String.fromCharCode(65 + optionIndex)}. ${option}
                  </button>
                `
              )
              .join('')}
          </div>
        </article>
      `
    )
    .join('');

  quizList.querySelectorAll('.answer-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const { question, option } = button.dataset;
      const correctIndex = quizItems[Number(question)].answer;
      const buttons = quizList.querySelectorAll(`[data-question="${question}"]`);

      buttons.forEach((btn) => {
        btn.disabled = true;
        const isCorrect = Number(btn.dataset.option) === correctIndex;
        if (isCorrect) btn.classList.add('correct');
        if (Number(btn.dataset.option) === Number(option) && !isCorrect) {
          btn.classList.add('incorrect');
        }
      });
    });
  });
}

function renderLabs() {
  labList.innerHTML = labTasks
    .map(
      (task) => `
        <div class="lab-item">
          <div>
            <strong>${task.title}</strong>
            <small>${task.detail}</small>
          </div>
          <span class="lab-tag">${task.tag}</span>
        </div>
      `
    )
    .join('');
}

function renderSchedule() {
  scheduleList.innerHTML = scheduleItems
    .map(
      (item) => `
        <div class="schedule-item">
          <div>
            <strong>${item.title}</strong>
            <small>${item.time}</small>
          </div>
          <span class="schedule-tag">${item.tag}</span>
        </div>
      `
    )
    .join('');
}

function renderCourseCatalog() {
  courseCatalogList.innerHTML = courseCatalog
    .map(
      (course) => `
        <div class="course-card">
          <div>
            <strong>${course.title}</strong>
            <small>${course.detail}</small>
          </div>
          <span class="course-pill">${course.badge}</span>
        </div>
      `
    )
    .join('');
}

function renderProtocols() {
  protocolList.innerHTML = safetyProtocols
    .map(
      (item) => `
        <div class="protocol-card">
          <div>
            <strong>${item.title}</strong>
            <small>${item.detail}</small>
          </div>
          <span class="protocol-pill">${item.badge}</span>
        </div>
      `
    )
    .join('');
}

function renderLessons() {
  lessonList.innerHTML = lessonPlans
    .map(
      (lesson) => `
        <div class="lesson-card">
          <div>
            <strong>${lesson.title}</strong>
            <small>${lesson.objective}</small>
          </div>
          <span class="lesson-pill">${lesson.duration}</span>
        </div>
      `
    )
    .join('');
}

function renderAssessmentBreakdown() {
  assessmentList.innerHTML = assessmentBreakdown
    .map(
      (item) => `
        <div class="assessment-row">
          <strong>${item.name}</strong>
          <span class="score-pill">${item.score}</span>
        </div>
      `
    )
    .join('');
}

function renderResources() {
  resourceList.innerHTML = resources
    .map(
      (item) => `
        <div class="resource-row">
          <strong>${item.title}</strong>
          <span class="resource-tag">${item.tag}</span>
        </div>
      `
    )
    .join('');
}

const averageProgress = Math.round(
  modules.reduce((total, module) => total + module.progress, 0) / modules.length
);
completionRate.textContent = `${averageProgress}%`;

renderModules();
renderChecklist();
renderSkills();
renderQuiz();
renderLabs();
renderSchedule();
renderCourseCatalog();
renderProtocols();
renderLessons();
renderAssessmentBreakdown();
renderResources();

const navButtons = document.querySelectorAll('.nav-item');
navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    navButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
  });
});
