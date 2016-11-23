var RUNLOOP = {};

var START_TIME = new Date().valueOf();

var data, delay, repeat, is_started;
var repeat = false;
var task1 = function (id) {
  var __msDate = new Date().valueOf();
  if (id) {
    $.writeln("_________________1." + id + " __________________" + (__msDate - START_TIME) );
  } else {
    $.writeln("_________________1__________________" + (__msDate - START_TIME) );
  }
};

var task2 = function (id) {
  var __msDate = new Date().valueOf();
  if (id) {
    $.writeln("_________________2." + id + " __________________" + (__msDate - START_TIME) );
  } else {
    $.writeln("_________________2__________________" + (__msDate - START_TIME) );
  }
};

var task3 = function (id) {
  var __msDate = new Date().valueOf();
  if (id) {
    $.writeln("_________________3." + id + " __________________" + (__msDate - START_TIME) );
  } else {
    $.writeln("_________________3__________________" + (__msDate - START_TIME) );
  }
};

var task4 = function (id) {
  var __msDate = new Date().valueOf();
  if (id) {
    $.writeln("_________________4." + id + " __________________" + (__msDate - START_TIME) );
  } else {
    $.writeln("_________________4__________________" + (__msDate - START_TIME) );
  }
};

var Schedule = function (data, delay, repeat, is_rescheduler) {

  this.rlId = null
  if (arguments.length === 1) {
    var sch_id = data;
    this.rlId = RUNLOOP[sch_id];
  }

  this.done = function (onFinished, onFinishedDelay) {
    if (!onFinishedDelay) {
      onFinishedDelay = 0;
    }
    if (RUNLOOP[this._rlId].taskId === 1) {
      app.scheduleTask(onFinished, onFinishedDelay, false);
    } else {
      var reschedule_string = "new Schedule("+ RUNLOOP[this._rlId]._id +").done('" +  onFinished + " ',  "+ onFinishedDelay + ");";
      app.scheduleTask(reschedule_string, 0, false);
    }
  }

  this.then = function (onFinished, onFinishedDelay) {
    if (!onFinishedDelay) {
      onFinishedDelay = 0;
    }
    var reschedule_string = "new Schedule("+ RUNLOOP[this._rlId]._id +").done('" +  onFinished + " /*is_rescheduler_injection*/ ' ,  "+ onFinishedDelay + ");";
    return new Schedule (reschedule_string, 0, false, true);
  }

  if (!this.rlId) {
    this._rlId = Math.floor(Math.random() * 10000000000);
    if (is_rescheduler) {
      var injection = " RUNLOOP[" + this._rlId + "].taskId = 1; ";
      data = data.replace('/*is_rescheduler_injection*/',  injection);
    } else {
      data = data + " RUNLOOP[" + this._rlId + "].taskId = 1; ";
    }
    RUNLOOP[this._rlId] = {};
    RUNLOOP[this._rlId]._id = this._rlId;
    RUNLOOP[this._rlId].self = this.toSource();
    RUNLOOP[this._rlId].taskId = app.scheduleTask(data, delay, false);
  } else {
    this._rlId = this.rlId._id;
  }
};

var f = new Schedule("task1(1); ", 100).then("task2(1);", 5000).then("task3(1);", 4000).then("task4(1);", 1000);
var f = new Schedule("task1(2); ", 100).then("task2(2);", 400).done('task3(2)', 10000);
