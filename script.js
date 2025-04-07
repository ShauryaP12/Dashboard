document.addEventListener('DOMContentLoaded', function(){
  /* ---------------------------
     Dark/Light Mode & Date/Time
  --------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const datetimeDisplay = document.getElementById('datetime');
  const body = document.body;

  if(localStorage.getItem('theme') === 'dark'){
    body.classList.add('dark');
  }
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
  });
  function updateDateTime(){
    const now = new Date();
    datetimeDisplay.textContent = now.toLocaleString();
  }
  setInterval(updateDateTime, 1000);
  updateDateTime();

  /* ---------------------------
     Pomodoro Timer Functionality
  --------------------------- */
  const timerDisplay = document.getElementById('timerDisplay');
  const startPauseBtn = document.getElementById('startPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const timerStatus = document.getElementById('timerStatus');
  const sessionStats = document.getElementById('sessionStats');
  const workTimeInput = document.getElementById('workTime');
  const breakTimeInput = document.getElementById('breakTime');
  const applyConfigBtn = document.getElementById('applyConfigBtn');

  let workDuration = parseInt(workTimeInput.value) * 60;
  let breakDuration = parseInt(breakTimeInput.value) * 60;
  let currentTime = workDuration;
  let timerInterval = null;
  let isWorkSession = true;
  let isRunning = false;
  let sessionsCompleted = parseInt(localStorage.getItem('sessionsCompleted')) || 0;

  function updateTimerDisplay(){
    const minutes = String(Math.floor(currentTime / 60)).padStart(2, '0');
    const seconds = String(currentTime % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }
  function switchSession(){
    isWorkSession = !isWorkSession;
    currentTime = isWorkSession ? workDuration : breakDuration;
    if(isWorkSession){
      sessionsCompleted++;
      timerStatus.textContent = `Work Session`;
      sessionStats.textContent = `Sessions Completed: ${sessionsCompleted}`;
      localStorage.setItem('sessionsCompleted', sessionsCompleted);
      updateAchievements();
      updateAnalytics();
    } else {
      timerStatus.textContent = 'Break Time';
    }
  }
  function toggleTimer(){
    if(isRunning){
      clearInterval(timerInterval);
      startPauseBtn.textContent = 'Start';
    } else {
      timerInterval = setInterval(() => {
        currentTime--;
        updateTimerDisplay();
        if(currentTime <= 0){
          clearInterval(timerInterval);
          switchSession();
          updateTimerDisplay();
          startPauseBtn.textContent = 'Start';
          isRunning = false;
        }
      }, 1000);
      startPauseBtn.textContent = 'Pause';
    }
    isRunning = !isRunning;
  }
  function resetTimer(){
    clearInterval(timerInterval);
    currentTime = isWorkSession ? workDuration : breakDuration;
    updateTimerDisplay();
    startPauseBtn.textContent = 'Start';
    isRunning = false;
  }
  startPauseBtn.addEventListener('click', toggleTimer);
  resetBtn.addEventListener('click', resetTimer);
  applyConfigBtn.addEventListener('click', () => {
    workDuration = parseInt(workTimeInput.value) * 60;
    breakDuration = parseInt(breakTimeInput.value) * 60;
    resetTimer();
    timerStatus.textContent = isWorkSession ? 'Work Session' : 'Break Time';
  });
  updateTimerDisplay();

  /* ---------------------------
     Task Manager Functionality
  --------------------------- */
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const taskStats = document.getElementById('taskStats');
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function saveTasks(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  function updateTaskStats(){
    const completed = tasks.filter(task => task.completed).length;
    taskStats.textContent = `Tasks Completed: ${completed}`;
    updateAchievements();
    updateAnalytics();
  }
  function renderTasks(){
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = task.completed ? 'completed' : '';

      const taskText = document.createElement('span');
      taskText.textContent = task.text;
      taskText.contentEditable = false;
      li.appendChild(taskText);

      const btnContainer = document.createElement('span');
      btnContainer.className = 'taskBtns';

      const completeBtn = document.createElement('button');
      completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
      completeBtn.className = 'completeBtn';
      completeBtn.addEventListener('click', () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
      });

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'editBtn';
      editBtn.addEventListener('click', () => {
        if(taskText.isContentEditable){
          taskText.contentEditable = false;
          tasks[index].text = taskText.textContent;
          editBtn.textContent = 'Edit';
          saveTasks();
        } else {
          taskText.contentEditable = true;
          taskText.focus();
          editBtn.textContent = 'Save';
        }
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'deleteBtn';
      deleteBtn.addEventListener('click', () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      btnContainer.appendChild(completeBtn);
      btnContainer.appendChild(editBtn);
      btnContainer.appendChild(deleteBtn);
      li.appendChild(btnContainer);
      taskList.appendChild(li);
    });
    updateTaskStats();
  }
  addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if(text !== ''){
      tasks.push({ text: text, completed: false });
      taskInput.value = '';
      saveTasks();
      renderTasks();
    }
  });
  renderTasks();

  /* ---------------------------
     Motivational Quote Functionality
  --------------------------- */
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuoteBtn');
  const customQuoteInput = document.getElementById('customQuoteInput');
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  let quotes = [
    "The secret of getting ahead is getting started.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future depends on what you do today.",
    "Believe you can and you're halfway there.",
    "It always seems impossible until it's done.",
    "Dream big and dare to fail.",
    "Start where you are. Use what you have. Do what you can."
  ];
  function displayRandomQuote(){
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = quotes[randomIndex];
  }
  newQuoteBtn.addEventListener('click', displayRandomQuote);
  addQuoteBtn.addEventListener('click', () => {
    const newQuote = customQuoteInput.value.trim();
    if(newQuote !== ''){
      quotes.push(newQuote);
      customQuoteInput.value = '';
      displayRandomQuote();
    }
  });
  displayRandomQuote();

  /* ---------------------------
     Notes Functionality
  --------------------------- */
  const noteText = document.getElementById('noteText');
  const saveNoteBtn = document.getElementById('saveNoteBtn');
  if(localStorage.getItem('note')){
    noteText.value = localStorage.getItem('note');
  }
  saveNoteBtn.addEventListener('click', () => {
    localStorage.setItem('note', noteText.value);
    saveNoteBtn.textContent = 'Saved!';
    setTimeout(() => saveNoteBtn.textContent = 'Save Note', 1500);
  });

  /* ---------------------------
     Analytics Functionality
  --------------------------- */
  const analyticsChart = document.getElementById('analyticsChart');
  const analyticsInfo = document.getElementById('analyticsInfo');
  const ctx = analyticsChart.getContext('2d');
  // We'll track daily totals for sessions and tasks completed.
  let analyticsData = JSON.parse(localStorage.getItem('analyticsData')) || {};
  function updateAnalytics(){
    const today = new Date().toISOString().slice(0,10);
    if(!analyticsData[today]){
      analyticsData[today] = { sessions: 0, tasks: 0 };
    }
    analyticsData[today].sessions = sessionsCompleted;
    analyticsData[today].tasks = tasks.filter(t => t.completed).length;
    localStorage.setItem('analyticsData', JSON.stringify(analyticsData));
    drawAnalyticsChart();
  }
  function drawAnalyticsChart(){
    // Simple bar chart: sessions in blue, tasks in green
    ctx.clearRect(0, 0, analyticsChart.width, analyticsChart.height);
    const dates = Object.keys(analyticsData).sort();
    const barWidth = 30;
    const gap = 20;
    const chartHeight = analyticsChart.height - 40;
    dates.forEach((date, i) => {
      const x = 50 + i * (barWidth * 2 + gap);
      const sessions = analyticsData[date].sessions;
      const tasksCompleted = analyticsData[date].tasks;
      // Scale factor for bar heights (assume max 50 sessions/tasks)
      const scale = chartHeight / 50;
      // Draw sessions bar (blue)
      ctx.fillStyle = '#3498db';
      ctx.fillRect(x, chartHeight - sessions * scale, barWidth, sessions * scale);
      // Draw tasks bar (green)
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(x + barWidth, chartHeight - tasksCompleted * scale, barWidth, tasksCompleted * scale);
      // Date label
      ctx.fillStyle = varCSS('--accent-color', '#2c3e50');
      ctx.font = '12px Roboto, sans-serif';
      ctx.fillText(date, x, chartHeight + 15);
    });
    analyticsInfo.textContent = "Blue: Pomodoro Sessions, Green: Tasks Completed";
  }
  // Fallback for CSS variable reading in canvas (if needed)
  function varCSS(name, fallback){
    return getComputedStyle(document.documentElement).getPropertyValue(name) || fallback;
  }
  updateAnalytics();

  /* ---------------------------
     Achievements Functionality
  --------------------------- */
  const achievementBadges = document.getElementById('achievementBadges');
  function updateAchievements(){
    achievementBadges.innerHTML = '';
    const badges = [];
    if(sessionsCompleted >= 5) badges.push("5 Sessions Milestone");
    if(sessionsCompleted >= 10) badges.push("10 Sessions Achieved");
    if(sessionsCompleted >= 20) badges.push("20+ Sessions Pro");
    const tasksCompleted = tasks.filter(t => t.completed).length;
    if(tasksCompleted >= 5) badges.push("5 Tasks Done");
    if(tasksCompleted >= 10) badges.push("10 Tasks Done");
    if(tasksCompleted >= 20) badges.push("Task Master");
    badges.forEach(badgeText => {
      const badge = document.createElement('div');
      badge.className = 'badge';
      badge.textContent = badgeText;
      achievementBadges.appendChild(badge);
    });
  }
  updateAchievements();

  /* ---------------------------
     Daily Journal Functionality
  --------------------------- */
  const journalText = document.getElementById('journalText');
  const saveJournalBtn = document.getElementById('saveJournalBtn');
  const journalList = document.getElementById('journalList');
  let journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];

  function renderJournal(){
    journalList.innerHTML = '';
    journalEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    journalEntries.forEach(entry => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${new Date(entry.date).toLocaleString()}:</strong><br>${entry.text}`;
      journalList.appendChild(li);
    });
  }
  saveJournalBtn.addEventListener('click', () => {
    const text = journalText.value.trim();
    if(text !== ''){
      const entry = { date: new Date().toISOString(), text };
      journalEntries.push(entry);
      localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
      journalText.value = '';
      renderJournal();
    }
  });
  renderJournal();
});
