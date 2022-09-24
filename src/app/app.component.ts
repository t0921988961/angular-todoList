import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from 'src/service/local-storage.service';
import { FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';

import { nanoid as randomId } from 'nanoid';

/*-- PrimeNg --*/
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { LayoutService } from './service/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService], // 問題回報 primeng Dialoag,
})


export class AppComponent implements OnInit {

  initTodo: any = [
    { tId: 'NcMjBXBIDWlrNVCIjaA14', content: '123', time: '2020-09-17 20:48:20', done: false },
    { tId: 'cBzgv-S8SJwbBjqijX6xv', content: '456', time: '2021-09-18 21:48:30', done: true },
    { tId: 'JXlsjKX8c81poDoPenXDL', content: '789', time: '2022-09-19 22:48:40', done: false },
    { tId: 'Pl-Zbw31MNBC1KgCOVcMO', content: '123', time: '2022-09-20 23:48:50', done: false }
  ];

  filter = 'all'; // all, active, done
  inputContent: any;

  displayEdit = false; // dialog edit todo
  selectedRows: any; // 證物分派表單 打勾
  loading = false; // table is loading
  /** 證物分派列表 */
  shareList: any = [];
  /** 證物分派列表 table欄位 */
  colShareList = [
    { field: 'select', header: '完成' },
    { field: 'tId', header: 'ID' },
    { field: 'content', header: '內容' },
    { field: 'time', header: '時間' },
    { field: 'function', header: '功能' },
  ];

  editTodo: any;
  editForm = this.formBuilder.group({
    content: ['', Validators.required], // todo content
  })

  constructor(
    private primengConfig: PrimeNGConfig,
    public localStorage: LocalStorageService,
    private formBuilder: FormBuilder,
    // primeng
    private confirmationService: ConfirmationService,
    public messageService: MessageService,
    public layoutService: LayoutService
  ) {
    this.initPrimeNg();
    this.localStorage.save('initTodo', this.initTodo);
  }

  ngOnInit() {
    this.readTodo('initTodo');

    this.layoutService.setPageLoading(false);
  }

  @ViewChild('dtExhibit') dt: any;

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  // 排序時間
  sortByTime(arr: []) {
    arr.sort((a: any, b: any) => {
      return <any>new Date(b.time) - <any>new Date(a.time);
    })
    console.log('排序時間 arr:', arr)
  }

  // 組裝 todo
  buildTodo(content: string) {
    let params = { tId: randomId(), content: content.trim(), time: moment().format('YYYY-MM-DD HH:mm:ss'), done: false };
    this.createTodo('initTodo', params);
    this.readTodo('initTodo');
    this.inputContent = '';

    this.messageService.add({
      severity: 'success',
      summary: 'Create success',
      detail: '',
      icon: 'bounce animated',
      life: 3000,
    });
  }

  // 準備更新
  doUpdate(rowData: any) {
    this.editTodo = rowData;
    this.displayEdit = true;

  }

  // 確認更新
  confirmUpdate() {
    this.updateTodo('initTodo', this.editTodo.tId, this.editForm.value.content);
    this.readTodo('initTodo');
    this.displayEdit = false;
    this.editTodo = '';
  }

  // 刪除
  prepareDelete(rowData: any) {
    this.confirmationService.confirm({
      key: 'confirm',
      header: `刪除`,
      icon: 'fa fa-trash',
      message: `是否要刪除「<strong>${rowData.tId}</strong>」？`,
      accept: () => {
        this.deleteTodo('initTodo', rowData.tId);
        this.readTodo('initTodo');
      },
      reject: () => {
      },
    });
  }

  setTodoId(todos: {}[]) {
    return todos.map((todo, idx) => {
      return { tId: idx, ...todo }
    })
  }

  createTodo(KEY: string, todo: object) {
    const todos: any = this.localStorage.load(KEY);
    todos.push(todo);
    this.localStorage.save(KEY, this.setTodoId(todos));
  }

  readTodo(KEY: string) {
    const todos: any = this.localStorage.load(KEY);
    this.sortByTime(todos);
    this.shareList = todos;
    this.initSelect();
  }

  updateTodo(KEY: string, tId: string, content: any) {
    let todos: any = this.localStorage.load(KEY);
    todos.map((item: any) => {
      if (item.tId === tId) { item.content = content }
      return item
    })
    this.editForm.reset();
    this.localStorage.save(KEY, todos);
  }


  closeTodo(KEY: string, tId: string) {
    let todos: any = this.localStorage.load(KEY);
    todos.map((item: any) => {
      if (item.tId === tId) { item.done = !item.done }
      return item
    })
    this.localStorage.save(KEY, todos);
  }

  deleteTodo(KEY: string, tId: string) {
    const todos: any = this.localStorage.load(KEY);
    let idx = todos.findIndex((item: any) => item.tId === tId);
    const spliceTodo = todos.splice(idx, 1);
    this.localStorage.save(KEY, todos);
    return spliceTodo;
  }

  clearAllTodo(KEY: string) {
    const todos: Array<{}> = [];
    this.localStorage.save('initTodo', todos);
    return {
      todos
    }
  }

  filterResult(filter: string) {
    this.shareList = this.filterList(filter);
  }

  filterList(filter: string) {
    const todos: any = this.localStorage.load('initTodo');
    // all, active, done
    if (filter === 'all') { return todos; }
    if (filter === 'active') { return todos.filter((todo: any) => !todo.done) }
    if (filter === 'done') { return todos.filter((todo: any) => todo.done); }
    else { return todos; }
  }


  // 檢查checkbox
  initSelect() {
    this.selectedRows = this.shareList.filter((item: any) => item.done === true);
    console.log('this.selectedRows:', this.selectedRows)
  }


  // 打勾完成
  selectRow(rowData: any) {
    this.closeTodo('initTodo', rowData.tId);
    this.readTodo('initTodo');
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
