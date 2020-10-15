import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  searchResult: Task[] = [];
  myTask: Task = {
    label : '',
    completed : false
  };
  constructor(private taskService: TaskService) { }


  showForm = true;
  editFrom = false;
  showSearch = true;
  searchValue = ""
  ngOnInit(): void {
    this.getTasks();
      this.search();
  }
  getTasks()  {
    this.taskService.findAll().subscribe(tasks => {
          this.tasks = this.searchResult = tasks
        }
      );
    
  }

  deleteTask(id) {
    this.taskService.delete(id)
      .subscribe(
        () => {
          this.tasks = this.tasks.filter(task => task.id != id)
        }
      )
  }

  persisteTask() {
    this.taskService.persiste(this.myTask)
      .subscribe(
        (task) => {
          this.tasks = [task, ...this.tasks];
          this.resetTask();
          this.search();
        }
      )
  }

  showFormNew() {
    this.showForm = !this.showForm;
  }

  showSearchForm() {
    this.showSearch = !this.showSearch;
    // this.showForm = false;
  }

  resetTask() {
    this.myTask = {
      label: '',
      completed: false
    }
  }

  toggleCompleted(task) {
    this.taskService.completed(task.id , task.completed)
      .subscribe(
        () => {
          task.completed = !task.completed;
        }
      );
  }

  fillTask(task){
    this.myTask = task;
    this.editFrom = true;
  }

  newTaskForm() {
    this.editFrom = false;
    this.showForm = true;
    this.resetTask();
  }

  updateTask() {
    this.taskService.update(this.myTask)
      .subscribe(task => {
        this.resetTask();
        this.editFrom = false;
        this.search();
      }
      );
  }

  search() {
    this.searchResult = this.tasks;
    this.searchResult = this.tasks.filter((task) => task.label.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase()));
  }
}
