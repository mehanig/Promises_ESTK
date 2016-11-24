# Promises_ESTK

Simple implementation of `Scheduler` object, which acts like a Promise object but in Adobe Extend Scripts world.

<b>It makes possible to spawn multiple async processes inside ExtendScript, and run them in determined order.</b>

Implements `.done` and `.then` functions

### How it works

It's based on `app.scheduleTask()`.
There is no way to acces detached running process started with `scheduleTask`.
Every time `app.scheduleTask` is called, it creates process in new jsvm. It's Adobe Bridge object, so it have no acces to running script variables, except all the globals.
Globals state is shared between all scripts. Scheduler communicates through this space between multiple processes.
It invoke and reschedules itself multiple times.

  
### How to use

It can only be used with ExtendScript engine, targeting Adobe After Effects. (Other Abobe products not tested yet)
![adobe](https://cloud.githubusercontent.com/assets/5033274/20584330/ae082cd0-b202-11e6-9de1-0023b90e7607.png)


Include `Scheduler` object in your file.
Use it with global functions, accesible from your main script.


### Examples

If you have multiple functions, you can invoke then asynchonously, without blocking main thread, but still have controll in order they run.

To run `task1` after `100ms` after instruction is readed, and then `1000ms` after `task1` is finished, run `task2`:

```
 var f = new Schedule("task1();", 100).done("task2();", 1000);
```

You also can pass parameters to task and spawn them simualtainesly:
```
var f = new Schedule("task1(1); ", 100).then("task2(1);", 5000).then("task3(1);", 4000).then("task4(1);", 1000);
var f = new Schedule("task1(2); ", 100).then("task2(2);", 400).done('task3(2)', 10000);
```
which will produce (see tasks functions definitions in `index.js`):

```
_________________1.1 __________________197
_________________1.2 __________________494
_________________2.2 __________________1516
_________________2.1 __________________6269
_________________3.1 __________________10526
_________________3.2 __________________11648
_________________4.1 __________________11747
```
Note the order of task and milliseconds since starting time.

### Notes

Process can only be spawned once. Repeating processes itn's supported. Because there is no clear understanding of this behavior at this moment.
Keep in mind that Adobe Bridge run-loop isn't very fast, so if you run `app.scheduleTask('..', 100, ...);` there is no guarantee that process will spavn after 100ms, it will schedule it to execute after 100ms in run-loop, when VM will be available, so this time might increase dramatically, depending of other processes.

This is VERY experimental.
