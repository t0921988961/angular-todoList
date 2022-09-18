import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from 'src/service/local-storage.service';

import * as moment from 'moment';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent implements OnInit {
  title = 'angular-todo-list';

  todoArr: { tId?: string, content: string, done: boolean }[] = [
    { content: '123', done: false },
    { content: '456', done: false },
    { content: '789', done: true }
  ];

  filter = 'all'; // all, active, done



  selectRow: any; // 證物分派表單 打勾
  /** 證物分派列表 */
  shareList: any = [
    { tID: '1', content: '123', time: '2022-09-18 23:48', done: false },
    { tID: '2', content: '456', time: '2022-09-18 23:48', done: false },
    { tID: '3', content: '789', time: '2022-09-18 23:48', done: false }
  ];
  /** 證物分派列表 table欄位 */
  colShareList = [
    { field: 'Select', header: '選擇' },
    { field: 'tID', header: '證物編號' },
    // { field: 'Sort', header: '編號' },
    { field: 'content', header: '內容' },
    { field: 'time', header: '時間' },
    { field: 'Function', header: '功能' },
  ];

  constructor(
    private primengConfig: PrimeNGConfig,
    public localStorage: LocalStorageService,
    private formBuilder: FormBuilder,
  ) {
    this.initPrimeNg();
    this.localStorage.save('initTodo', [])
    console.log('moment', moment().format(''))
  }

  ngOnInit() {
    // TEST
    // this.readTodo('initTodo');
    // this.createTodo('initTodo', { content: 123 });
    // this.createTodo('initTodo', { content: 456 });
    // this.createTodo('initTodo', { content: 789 });

    // setTimeout(() => { this.updateTodo('initTodo', '1', 456789); }, 4000)
    // setTimeout(() => { this.deleteTodo('initTodo', '1'); }, 8000)
    // setTimeout(() => { this.clearAllTodo('initTodo'); }, 12000)
  }

  setTodoId(todos: {}[]) {
    return todos.map((todo, idx) => {
      return { tId: idx, ...todo }
    })
  }

  createTodo(KEY: string, todo: object) {
    // 1 讀取
    const todos: any = this.localStorage.load(KEY);
    todos.push(todo);
    this.localStorage.save(KEY, this.setTodoId(todos));
    // 3 return
    return { tId: todos?.length - 1, todos }
  }

  readTodo(KEY: string) {
    // 1 讀取
    const todos: any = this.localStorage.load(KEY);
    // 2 給值
    this.todoArr = todos;
    // 3 return
    return todos
  }

  updateTodo(KEY: string, tId: string, content: any) {
    // deleteTodo
    const todos: any = this.localStorage.load(KEY);
    todos[tId].content = content;
    this.localStorage.save(KEY, todos);
    // 3 return
    return {
      tId,
      content: todos[tId]
    }
  }

  deleteTodo(KEY: string, tId: string) {
    // deleteTodo
    const todos: any = this.localStorage.load(KEY);
    const spliceTodo = todos.splice(tId, 1);
    this.localStorage.save(KEY, todos);
    // 3 return
    return {
      tId: null,
      spliceTodo
    }
  }

  clearAllTodo(KEY: string) {
    const todos: Array<{}> = [];
    this.localStorage.save('initTodo', todos);
    return {
      todos
    }
  }

  filterResult(filter: string) {
    this.todoArr = this.filterList(filter);
  }

  filterList(filter: string) {
    // all, active, done
    switch (filter) {
      case 'all':
        return this.todoArr;
        break
      case 'active':
        return this.todoArr.filter((todo) => !todo.done)
        break
      case 'done':
        return this.todoArr.filter((todo) => todo.done);
        break
      default:
        return this.todoArr;
    }
  }


  // 檢查checkbox
  checkSelectedTestUser() {

  }


  // primeng Init
  initPrimeNg() {
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation({
      accept: '確認',
      reject: '取消',
      dayNames: ['日', '一', '二', '三', '四', '五', '六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      monthNames: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
      ],
      monthNamesShort: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
      ],
      today: '確認',
      clear: '清除',
      weekHeader: 'Wk',
    });
  }
}
